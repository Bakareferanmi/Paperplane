import { a as MAX_FILE_BYTES, n as ALLOWED_TYPES, o as extensionOf, r as CLASS_CODES, t as ALLOWED_EXTENSIONS } from "./upload-rules-CUvKqSeP.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/submissions-BN5k0OXD.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fileSchema = object({
	fileName: string().min(1).max(180),
	fileType: string().max(120),
	fileSize: number().int().positive().max(MAX_FILE_BYTES),
	fileData: string().min(1).max(6e6)
});
var submitSchema = object({
	studentName: string().trim().min(2, "Name needs at least 2 characters").max(80, "Name is too long"),
	classCode: _enum(CLASS_CODES),
	subject: string().trim().max(80).optional().default(""),
	files: array(fileSchema).min(1, "Add at least one file").max(4)
});
function assertAllowedFile(file) {
	const ext = extensionOf(file.fileName);
	const typeOk = file.fileType ? ALLOWED_TYPES.has(file.fileType) : false;
	const extOk = ALLOWED_EXTENSIONS.has(ext);
	if (!typeOk && !extOk) throw new Error(`"${file.fileName}" is not an allowed file type.`);
}
var createSubmission_createServerFn_handler = createServerRpc({
	id: "ae516e6c0c54e63d74872de355a42442ecedd16a0a054f49e1ea2cd5b721d405",
	name: "createSubmission",
	filename: "src/lib/submissions.ts"
}, (opts) => createSubmission.__executeServer(opts));
var createSubmission = createServerFn({ method: "POST" }).validator(submitSchema).handler(createSubmission_createServerFn_handler, async ({ data }) => {
	if (data.files.reduce((sum, file) => sum + file.fileSize, 0) > 8388608) throw new Error("Keep the whole drop under 8 MB.");
	for (const file of data.files) assertAllowedFile(file);
	const { getSql } = await import("./db-BDkIwowC.mjs");
	const sql = await getSql();
	const id = (await sql`
      insert into submissions (student_name, class_code, subject)
      values (${data.studentName}, ${data.classCode}, ${data.subject ?? ""})
      returning id
    `)[0]?.id;
	if (!id) throw new Error("Could not save this submission.");
	for (const file of data.files) await sql`
        insert into submission_files (submission_id, file_name, file_type, file_size, file_data)
        values (
          ${id},
          ${file.fileName},
          ${file.fileType || "application/octet-stream"},
          ${file.fileSize},
          ${file.fileData}
        )
      `;
	return { id };
});
var listSubmissions_createServerFn_handler = createServerRpc({
	id: "8e3564409c62ec723e577c7bad454f0935d5006f3e641ceeb92224f07554af91",
	name: "listSubmissions",
	filename: "src/lib/submissions.ts"
}, (opts) => listSubmissions.__executeServer(opts));
var listSubmissions = createServerFn({ method: "GET" }).handler(listSubmissions_createServerFn_handler, async () => {
	const { getSql } = await import("./db-BDkIwowC.mjs");
	return (await (await getSql())`
      select
        s.id,
        s.student_name,
        s.class_code,
        s.subject,
        s.created_at::text as created_at,
        (
          select count(*)::int from submission_files f where f.submission_id = s.id
        ) as file_count
      from submissions s
      order by s.created_at desc
      limit 200
    `).map((row) => ({
		id: row.id,
		studentName: row.student_name,
		classCode: row.class_code,
		subject: row.subject,
		createdAt: row.created_at,
		fileCount: row.file_count
	}));
});
var listSubmissionFiles_createServerFn_handler = createServerRpc({
	id: "4b5c59e62ec1e6c360df8afb98a0a1a36445200e5ab2fe834f5f8beee0c20917",
	name: "listSubmissionFiles",
	filename: "src/lib/submissions.ts"
}, (opts) => listSubmissionFiles.__executeServer(opts));
var listSubmissionFiles = createServerFn({ method: "POST" }).validator(object({ submissionId: number().int().positive() })).handler(listSubmissionFiles_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-BDkIwowC.mjs");
	return (await (await getSql())`
      select id, file_name, file_type, file_size
      from submission_files
      where submission_id = ${data.submissionId}
      order by id
    `).map((row) => ({
		id: row.id,
		fileName: row.file_name,
		fileType: row.file_type,
		fileSize: row.file_size
	}));
});
var getSubmissionFile_createServerFn_handler = createServerRpc({
	id: "84b3b7d63ac2def7b71fe0933dfb2da337d217c7244ed47beae0915dc0c9c7f3",
	name: "getSubmissionFile",
	filename: "src/lib/submissions.ts"
}, (opts) => getSubmissionFile.__executeServer(opts));
var getSubmissionFile = createServerFn({ method: "POST" }).validator(object({ fileId: number().int().positive() })).handler(getSubmissionFile_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-BDkIwowC.mjs");
	const row = (await (await getSql())`
      select file_name, file_type, file_data
      from submission_files
      where id = ${data.fileId}
      limit 1
    `)[0];
	if (!row) throw new Error("File not found.");
	return {
		fileName: row.file_name,
		fileType: row.file_type,
		fileData: row.file_data
	};
});
//#endregion
export { createSubmission_createServerFn_handler, getSubmissionFile_createServerFn_handler, listSubmissionFiles_createServerFn_handler, listSubmissions_createServerFn_handler };
