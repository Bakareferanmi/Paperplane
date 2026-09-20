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
  files: z.array(fileSchema).min(1, "Add at least one file").max(MAX_FILES),
});

export type SubmissionListItem = {
  id: number;
  assignmentId: string;
  studentName: string;
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

    let id: number | undefined;
    let assignmentId = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      assignmentId = generateAssignmentId();
      try {
        const rows = await sql<{ id: number }>`
          insert into submissions (student_name, class_code, subject, assignment_id)
          values (${data.studentName}, ${data.classCode}, ${data.subject ?? ""}, ${assignmentId})
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

    return { id, assignmentId };
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
    }>`
      select
        s.id,
        s.assignment_id,
        s.student_name,
        s.class_code,
        s.subject,
        s.created_at::text as created_at,
        s.marks,
        (
          select count(*)::int from submission_files f where f.submission_id = s.id
        ) as file_count
      from submissions s
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
