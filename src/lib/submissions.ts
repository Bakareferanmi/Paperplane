import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CLASS_CODES } from "./classes";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  extensionOf,
} from "./upload-rules";

export { MAX_FILES, MAX_FILE_BYTES, MAX_TOTAL_BYTES, isAllowedUpload } from "./upload-rules";

const fileSchema = z.object({
  fileName: z.string().min(1).max(180),
  fileType: z.string().max(120),
  fileSize: z.number().int().positive().max(MAX_FILE_BYTES),
  fileData: z.string().min(1).max(6_000_000),
});

const submitSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Name needs at least 2 characters")
    .max(80, "Name is too long"),
  classCode: z.enum(CLASS_CODES),
  subject: z.string().trim().max(80).optional().default(""),
  studentId: z.string().trim().max(20).optional().default(""),
  files: z.array(fileSchema).min(1, "Add at least one file").max(MAX_FILES),
});

export type SubmissionListItem = {
  id: number;
  assignmentId: string;
  studentName: string;
  studentId: string | null;
  classCode: string;
  subject: string;
  createdAt: string;
  fileCount: number;
  marks: number | null;
};

export type SubmissionFileMeta = {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export type StudentHistoryItem = {
  assignmentId: string;
  subject: string;
  createdAt: string;
  marks: number | null;
};

export type StudentProfile = {
  studentId: string;
  studentName: string;
  classCode: string;
  submissions: StudentHistoryItem[];
};

function assertAllowedFile(file: z.infer<typeof fileSchema>) {
  const ext = extensionOf(file.fileName);
  const typeOk = file.fileType ? ALLOWED_TYPES.has(file.fileType) : false;
  const extOk = ALLOWED_EXTENSIONS.has(ext);
  if (!typeOk && !extOk) {
    throw new Error(`"${file.fileName}" is not an allowed file type.`);
  }
}

function generateAssignmentId(): string {
  const digits = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `BAKARE${digits}`;
}

function generateStudentId(): string {
  const digits = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `BAKARESTU${digits}`;
}

export const createSubmission = createServerFn({ method: "POST" })
  .validator(submitSchema)
  .handler(async ({ data }) => {
    const total = data.files.reduce((sum, file) => sum + file.fileSize, 0);
    if (total > MAX_TOTAL_BYTES) {
      throw new Error("Keep the whole drop under 8 MB.");
    }
    for (const file of data.files) assertAllowedFile(file);

    const { getSql } = await import("@/lib/db");
    const sql = await getSql();


    let studentRefId: number;
    let studentId = data.studentId.trim().toUpperCase();
    let isNewStudent = false;
    let matchedByName = false;

    if (studentId) {
      const rows = await sql<{ id: number }>`
        select id from students where student_id = ${studentId} limit 1
      `;
      const row = rows[0];
      if (!row) throw new Error("That Student ID wasn't found. Leave it blank to get a new one.");
      studentRefId = row.id;
    } else {
      const existing = await sql<{ id: number; student_id: string }>`
        select id, student_id from students
        where lower(student_name) = lower(${data.studentName})
          and class_code = ${data.classCode}
        order by created_at desc
        limit 1
      `;
      const match = existing[0];
      if (match) {
        studentRefId = match.id;
        studentId = match.student_id;
        matchedByName = true;
      } else {
        isNewStudent = true;
        let newId: number | undefined;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          studentId = generateStudentId();
          try {
            const rows = await sql<{ id: number }>`
              insert into students (student_id, student_name, class_code)
              values (${studentId}, ${data.studentName}, ${data.classCode})
              returning id
            `;
            newId = rows[0]?.id;
            break;
          } catch (error) {
            const code = (error as { code?: string } | undefined)?.code;
            if (code === "23505") continue;
            throw error;
          }
        }
        if (!newId) throw new Error("Could not create a student profile.");
        studentRefId = newId;
      }
    }

    let id: number | undefined;
    let assignmentId = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      assignmentId = generateAssignmentId();
      try {
        const rows = await sql<{ id: number }>`
          insert into submissions (student_name, class_code, subject, assignment_id, student_ref_id)
          values (${data.studentName}, ${data.classCode}, ${data.subject ?? ""}, ${assignmentId}, ${studentRefId})
          returning id
        `;
        id = rows[0]?.id;
        break;
      } catch (error) {
        const code = (error as { code?: string } | undefined)?.code;
        if (code === "23505") continue;
        throw error;
      }
    }
    if (!id) throw new Error("Could not save this submission.");

    for (const file of data.files) {
      await sql`
        insert into submission_files (submission_id, file_name, file_type, file_size, file_data)
        values (
          ${id},
          ${file.fileName},
          ${file.fileType || "application/octet-stream"},
          ${file.fileSize},
          ${file.fileData}
        )
      `;
    }

    return { id, assignmentId, studentId, isNewStudent, matchedByName };
  });

export const listSubmissions = createServerFn({ method: "GET" }).handler(
  async (): Promise<SubmissionListItem[]> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      assignment_id: string;
      student_name: string;
      class_code: string;
      subject: string;
      created_at: string;
      file_count: number;
      marks: number | null;
      student_id: string | null;
    }>`
      select
        s.id,
        s.assignment_id,
        s.student_name,
        s.class_code,
        s.subject,
        s.created_at::text as created_at,
        s.marks,
        st.student_id,
        (
          select count(*)::int from submission_files f where f.submission_id = s.id
        ) as file_count
      from submissions s
      left join students st on st.id = s.student_ref_id
      order by s.created_at desc
      limit 200
    `;
    return rows.map((row) => ({
      id: row.id,
      assignmentId: row.assignment_id,
      studentName: row.student_name,
      classCode: row.class_code,
      subject: row.subject,
      createdAt: row.created_at,
      fileCount: row.file_count,
      marks: row.marks,
      studentId: row.student_id,
    }));
  },
);

export const setMarks = createServerFn({ method: "POST" })
  .validator(
    z.object({
      submissionId: z.number().int().positive(),
      marks: z.number().int().min(1).max(10),
    }),
  )
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`update submissions set marks = ${data.marks} where id = ${data.submissionId}`;
    return { ok: true };
  });

export const listSubmissionFiles = createServerFn({ method: "POST" })
  .validator(z.object({ submissionId: z.number().int().positive() }))
  .handler(async ({ data }): Promise<SubmissionFileMeta[]> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      file_name: string;
      file_type: string;
      file_size: number;
    }>`
      select id, file_name, file_type, file_size
      from submission_files
      where submission_id = ${data.submissionId}
      order by id
    `;
    return rows.map((row) => ({
      id: row.id,
      fileName: row.file_name,
      fileType: row.file_type,
      fileSize: row.file_size,
    }));
  });

export const getSubmissionFile = createServerFn({ method: "POST" })
  .validator(z.object({ fileId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      file_name: string;
      file_type: string;
      file_data: string;
    }>`
      select file_name, file_type, file_data
      from submission_files
      where id = ${data.fileId}
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("File not found.");
    return {
      fileName: row.file_name,
      fileType: row.file_type,
      fileData: row.file_data,
    };
  });

export const lookupSubmission = createServerFn({ method: "POST" })
  .validator(z.object({ assignmentId: z.string().trim().min(1).max(20) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      assignment_id: string;
      student_name: string;
      class_code: string;
      subject: string;
      created_at: string;
      marks: number | null;
    }>`
      select assignment_id, student_name, class_code, subject, created_at::text as created_at, marks
      from submissions
      where assignment_id = ${data.assignmentId.toUpperCase()}
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("No assignment found with that ID.");
    return {
      assignmentId: row.assignment_id,
      studentName: row.student_name,
      classCode: row.class_code,
      subject: row.subject,
      createdAt: row.created_at,
      marks: row.marks,
    };
  });

export const lookupStudent = createServerFn({ method: "POST" })
  .validator(z.object({ studentId: z.string().trim().min(1).max(20) }))
  .handler(async ({ data }): Promise<StudentProfile> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const studentId = data.studentId.toUpperCase();
    const studentRows = await sql<{
      id: number;
      student_id: string;
      student_name: string;
      class_code: string;
    }>`
      select id, student_id, student_name, class_code
      from students
      where student_id = ${studentId}
      limit 1
    `;
    const student = studentRows[0];
    if (!student) throw new Error("No student found with that ID.");

    const submissionRows = await sql<{
      assignment_id: string;
      subject: string;
      created_at: string;
      marks: number | null;
    }>`
      select assignment_id, subject, created_at::text as created_at, marks
      from submissions
      where student_ref_id = ${student.id}
      order by created_at desc
    `;

    return {
      studentId: student.student_id,
      studentName: student.student_name,
      classCode: student.class_code,
      submissions: submissionRows.map((row) => ({
        assignmentId: row.assignment_id,
        subject: row.subject,
        createdAt: row.created_at,
        marks: row.marks,
      })),
    };
  });
