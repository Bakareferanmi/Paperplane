export const MAX_FILES = 4;
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 8 * 1024 * 1024;

export const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "zip",
  "txt",
  "csv",
  "png",
  "jpg",
  "jpeg",
  "webp",
]);

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function isAllowedUpload(file: { name: string; type: string; size: number }): string | null {
  if (file.size <= 0) return "That file is empty.";
  if (file.size > MAX_FILE_BYTES) return `${file.name} is over 4 MB.`;
  const ext = extensionOf(file.name);
  const typeOk = file.type ? ALLOWED_TYPES.has(file.type) : false;
  const extOk = ALLOWED_EXTENSIONS.has(ext);
  if (!typeOk && !extOk) return `${file.name} is not an allowed type.`;
  return null;
}
