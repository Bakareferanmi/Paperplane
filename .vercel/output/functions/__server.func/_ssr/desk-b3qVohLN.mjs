import { o as __toESM } from "../_runtime.mjs";
import { i as CLASS_LABELS, r as CLASS_CODES } from "./upload-rules-CUvKqSeP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as LoaderCircle, s as Inbox, u as Download } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, c as getSubmissionFile, i as SiteHeader, l as listSubmissionFiles, n as Card, r as CardContent, s as formatBytes, t as Button, u as listSubmissions } from "./card-ej1DT_CW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-b3qVohLN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		outline: "text-foreground shadow-(--shadow-border)"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function formatWhen(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}
function base64ToBlob(b64, type) {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return new Blob([bytes], { type: type || "application/octet-stream" });
}
function TeacherDesk() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [files, setFiles] = (0, import_react.useState)({});
	const [loadingFiles, setLoadingFiles] = (0, import_react.useState)(null);
	const [downloading, setDownloading] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		listSubmissions().then((data) => {
			if (!cancelled) setRows(data);
		}).catch((error) => {
			if (!cancelled) {
				setRows([]);
				toast.error(error instanceof Error ? error.message : "Could not load the desk.");
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const visible = (0, import_react.useMemo)(() => {
		if (!rows) return [];
		if (filter === "all") return rows;
		return rows.filter((row) => row.classCode === filter);
	}, [rows, filter]);
	const counts = (0, import_react.useMemo)(() => {
		const next = { all: rows?.length ?? 0 };
		for (const code of CLASS_CODES) next[code] = 0;
		for (const row of rows ?? []) next[row.classCode] = (next[row.classCode] ?? 0) + 1;
		return next;
	}, [rows]);
	async function toggleFiles(id) {
		if (openId === id) {
			setOpenId(null);
			return;
		}
		setOpenId(id);
		if (files[id]) return;
		setLoadingFiles(id);
		try {
			const list = await listSubmissionFiles({ data: { submissionId: id } });
			setFiles((prev) => ({
				...prev,
				[id]: list
			}));
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not open files.");
		} finally {
			setLoadingFiles(null);
		}
	}
	async function downloadFile(fileId, fileName) {
		setDownloading(fileId);
		try {
			const file = await getSubmissionFile({ data: { fileId } });
			const blob = base64ToBlob(file.fileData, file.fileType);
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = file.fileName || fileName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Download failed.");
		} finally {
			setDownloading(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					label: "All classes",
					count: counts.all ?? 0,
					active: filter === "all",
					onClick: () => setFilter("all")
				}), CLASS_CODES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					label: code,
					count: counts[code] ?? 0,
					active: filter === code,
					onClick: () => setFilter(code)
				}, code))]
			}),
			rows === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex items-center gap-3 py-10 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Opening the desk…"]
			}) }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center gap-3 py-14 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-12 items-center justify-center rounded-md bg-secondary text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No papers yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "When students send work, it lands here."
				})] })]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: visible.map((row) => {
					const open = openId === row.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-3 p-4 sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-base font-semibold",
										children: row.studentName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: row.classCode
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										row.subject ? row.subject : "Untitled drop",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-1.5 text-border",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatWhen(row.createdAt)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-1.5 text-border",
											children: "·"
										}),
										row.fileCount,
										" ",
										row.fileCount === 1 ? "file" : "files"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								className: "w-full sm:w-auto",
								onClick: () => void toggleFiles(row.id),
								children: open ? "Hide files" : "Open files"
							})]
						}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md bg-secondary/60 p-2",
							children: loadingFiles === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-3 text-sm text-muted-foreground",
								children: "Loading files…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-1",
								children: (files[row.id] ?? []).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 rounded-sm px-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-medium",
											children: file.fileName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground tabular-nums",
											children: formatBytes(file.fileSize)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										disabled: downloading === file.id,
										onClick: () => void downloadFile(file.id, file.fileName),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), downloading === file.id ? "Saving" : "Download"]
									})]
								}, file.id))
							})
						}) : null]
					}) }) }, row.id);
				})
			}),
			filter !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [CLASS_LABELS[filter], " only."]
			}) : null
		]
	});
}
function FilterChip({ label, count, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `inline-flex h-11 min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors duration-150 ${active ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)"}`,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `tabular-nums ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`,
			children: count
		})]
	});
}
function DeskPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { current: "desk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "reveal flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight sm:text-4xl",
					children: "Teacher desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-base text-muted-foreground",
					children: "Every paper students send lands here. Open a drop to download the files."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reveal reveal-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherDesk, {})
			})]
		})]
	});
}
//#endregion
export { DeskPage as component };
