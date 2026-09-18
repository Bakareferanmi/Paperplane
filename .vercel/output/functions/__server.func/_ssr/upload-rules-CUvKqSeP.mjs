//#region node_modules/.nitro/vite/services/ssr/assets/upload-rules-CUvKqSeP.js
var CLASS_CODES = [
	"SS1",
	"SS2",
	"SS3"
];
var CLASS_LABELS = {
	SS1: "Senior Secondary 1",
	SS2: "Senior Secondary 2",
	SS3: "Senior Secondary 3"
};
var MAX_FILE_BYTES = 4194304;
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
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
	"image/webp"
]);
var ALLOWED_EXTENSIONS = /* @__PURE__ */ new Set([
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
	"webp"
]);
function extensionOf(name) {
	const dot = name.lastIndexOf(".");
	return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}
function isAllowedUpload(file) {
	if (file.size <= 0) return "That file is empty.";
	if (file.size > 4194304) return `${file.name} is over 4 MB.`;
	const ext = extensionOf(file.name);
	const typeOk = file.type ? ALLOWED_TYPES.has(file.type) : false;
	const extOk = ALLOWED_EXTENSIONS.has(ext);
	if (!typeOk && !extOk) return `${file.name} is not an allowed type.`;
	return null;
}
//#endregion
export { MAX_FILE_BYTES as a, CLASS_LABELS as i, ALLOWED_TYPES as n, extensionOf as o, CLASS_CODES as r, isAllowedUpload as s, ALLOWED_EXTENSIONS as t };
