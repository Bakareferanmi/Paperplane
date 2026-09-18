import "../_runtime.mjs";
import { a as MAX_FILE_BYTES, r as CLASS_CODES } from "./upload-rules-CUvKqSeP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { i as Send } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function SiteHeader({ current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 text-foreground no-underline",
				"aria-label": "Paperplane home",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-semibold tracking-tight",
					children: "Paperplane"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1 rounded-lg bg-secondary/70 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					to: "/",
					active: current === "submit",
					children: "Submit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					to: "/desk",
					active: current === "desk",
					children: "Teacher desk"
				})]
			})]
		})
	});
}
function NavLink({ to, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: cn("inline-flex h-9 min-h-9 items-center rounded-md px-3 text-sm font-medium no-underline transition-colors duration-150", active ? "bg-card text-foreground shadow-(--shadow-border)" : "text-muted-foreground hover:text-foreground"),
		children
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var createSubmission = createServerFn({ method: "POST" }).validator(submitSchema).handler(createSsrRpc("ae516e6c0c54e63d74872de355a42442ecedd16a0a054f49e1ea2cd5b721d405"));
var listSubmissions = createServerFn({ method: "GET" }).handler(createSsrRpc("8e3564409c62ec723e577c7bad454f0935d5006f3e641ceeb92224f07554af91"));
var listSubmissionFiles = createServerFn({ method: "POST" }).validator(object({ submissionId: number().int().positive() })).handler(createSsrRpc("4b5c59e62ec1e6c360df8afb98a0a1a36445200e5ab2fe834f5f8beee0c20917"));
var getSubmissionFile = createServerFn({ method: "POST" }).validator(object({ fileId: number().int().positive() })).handler(createSsrRpc("84b3b7d63ac2def7b71fe0933dfb2da337d217c7244ed47beae0915dc0c9c7f3"));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out outline-none focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-(--shadow-border) hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground shadow-(--shadow-border) hover:bg-secondary/80",
			outline: "bg-card text-foreground shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)",
			ghost: "text-foreground hover:bg-secondary",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 min-h-11 px-4",
			sm: "h-9 min-h-9 rounded-sm px-3",
			lg: "h-12 min-h-12 rounded-lg px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		className: cn("rounded-xl bg-card text-card-foreground shadow-(--shadow-lift)", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("p-6 pt-0", className),
		...props
	});
}
//#endregion
export { cn as a, getSubmissionFile as c, SiteHeader as i, listSubmissionFiles as l, Card as n, createSubmission as o, CardContent as r, formatBytes as s, Button as t, listSubmissions as u };
