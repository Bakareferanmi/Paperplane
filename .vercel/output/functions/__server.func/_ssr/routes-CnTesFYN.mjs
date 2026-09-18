import { o as __toESM } from "../_runtime.mjs";
import { i as CLASS_LABELS, r as CLASS_CODES, s as isAllowedUpload } from "./upload-rules-CUvKqSeP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Paperclip, c as Image, d as ChevronUp, f as ChevronDown, i as Send, l as FileText, p as Check, r as Trash2, t as Upload } from "../_libs/lucide-react.mjs";
import { a as cn, i as SiteHeader, n as Card, o as createSubmission, r as CardContent, s as formatBytes, t as Button } from "./card-ej1DT_CW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectScrollDownButton$1, d as SelectValue$1, f as SelectViewport, i as SelectItem$1, l as SelectScrollUpButton$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectTrigger$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CnTesFYN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("h-11 w-full min-w-0 rounded-md bg-card px-3 text-base text-foreground shadow-(--shadow-border) outline-none transition-[box-shadow] duration-150 ease-out placeholder:text-muted-foreground md:text-sm", "focus-visible:ring-ring/40 focus-visible:ring-[3px]", "disabled:pointer-events-none disabled:opacity-50", "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "label",
		className: cn("text-sm font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
function Select({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
		"data-slot": "select",
		...props
	});
}
function SelectValue({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue$1, {
		"data-slot": "select-value",
		...props
	});
}
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		"data-slot": "select-trigger",
		className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-md bg-card px-3 text-sm text-foreground shadow-(--shadow-border) outline-none transition-[box-shadow] duration-150 ease-out", "focus-visible:ring-ring/40 focus-visible:ring-[3px]", "disabled:cursor-not-allowed disabled:opacity-50", "data-[placeholder]:text-muted-foreground", "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {})
		})]
	});
}
function SelectContent({ className, children, position = "popper", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
		"data-slot": "select-content",
		className: cn("relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-(--shadow-lift)", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
		position,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
				className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
		]
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-2.5 pr-8 pl-2 text-sm outline-none select-none", "focus:bg-secondary focus:text-secondary-foreground", "data-disabled:pointer-events-none data-disabled:opacity-50", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
	});
}
function FileDropzone({ files, onChange, onError, disabled }) {
	const inputRef = (0, import_react.useRef)(null);
	const [hot, setHot] = (0, import_react.useState)(false);
	function addFiles(list) {
		const incoming = Array.from(list);
		const next = [...files];
		let used = next.reduce((sum, item) => sum + item.size, 0);
		for (const file of incoming) {
			const reason = isAllowedUpload(file);
			if (reason) {
				onError(reason);
				continue;
			}
			if (next.length >= 4) {
				onError(`You can send up to 4 files.`);
				break;
			}
			if (used + file.size > 8388608) {
				onError("Keep the whole drop under 8 MB.");
				continue;
			}
			if (next.some((item) => item.name === file.name && item.size === file.size)) continue;
			used += file.size;
			next.push({
				id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
				name: file.name,
				type: file.type,
				size: file.size,
				file
			});
		}
		onChange(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onDragOver: (event) => {
				event.preventDefault();
				if (!disabled) setHot(true);
			},
			onDragLeave: () => setHot(false),
			onDrop: (event) => {
				event.preventDefault();
				setHot(false);
				if (!disabled && event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
			},
			className: cn("flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg bg-secondary/50 px-4 py-8 text-center shadow-(--shadow-border) transition-[transform,background-color,box-shadow] duration-200 ease-out", hot && "drop-hot bg-secondary shadow-(--shadow-border-hover)", disabled && "opacity-60"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex size-12 items-center justify-center rounded-md bg-card text-primary shadow-(--shadow-border) transition-transform duration-200", hot && "scale-105"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Drop your work here"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xs text-xs text-muted-foreground",
					children: "PDF, Word, PowerPoint, Excel, images, text, or zip. Up to 4 files, 4 MB each."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled,
					className: "mt-1",
					onClick: () => inputRef.current?.click(),
					children: "Choose files"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					multiple: true,
					className: "sr-only",
					disabled,
					onChange: (event) => {
						if (event.target.files) addFiles(event.target.files);
						event.target.value = "";
					}
				})
			]
		}), files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: files.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 rounded-md bg-card px-3 py-2 shadow-(--shadow-border)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-sm bg-secondary text-primary",
						children: item.type.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4" }) : item.type === "application/pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground tabular-nums",
							children: formatBytes(item.size)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						className: "size-9",
						disabled,
						"aria-label": `Remove ${item.name}`,
						onClick: () => onChange(files.filter((file) => file.id !== item.id)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, item.id))
		}) : null]
	});
}
function firstName(full) {
	return full.trim().split(/\s+/)[0] ?? "";
}
function readAsBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result ?? "");
			const comma = result.indexOf(",");
			resolve(comma >= 0 ? result.slice(comma + 1) : result);
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error(`Could not read ${file.name}`));
		reader.readAsDataURL(file);
	});
}
function AssignmentForm() {
	const [name, setName] = (0, import_react.useState)("");
	const [classCode, setClassCode] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(null);
	const [launching, setLaunching] = (0, import_react.useState)(false);
	const greeting = (0, import_react.useMemo)(() => {
		const nick = firstName(name);
		if (nick.length >= 2) return `Ready when you are, ${nick}.`;
		return "Fill this in, attach your work, and send it flying.";
	}, [name]);
	const stepsDone = (name.trim().length >= 2 ? 1 : 0) + (classCode ? 1 : 0) + (files.length > 0 ? 1 : 0);
	async function handleSubmit(event) {
		event.preventDefault();
		if (name.trim().length < 2) {
			toast.error("Add your full name so your teacher knows who sent this.");
			return;
		}
		if (!classCode) {
			toast.error("Pick your class from the list.");
			return;
		}
		if (files.length === 0) {
			toast.error("Drop at least one file.");
			return;
		}
		setSending(true);
		try {
			const encoded = await Promise.all(files.map(async (item) => ({
				fileName: item.name,
				fileType: item.type,
				fileSize: item.size,
				fileData: await readAsBase64(item.file)
			})));
			await createSubmission({ data: {
				studentName: name.trim(),
				classCode,
				subject: subject.trim(),
				files: encoded
			} });
			setLaunching(true);
			window.setTimeout(() => {
				setSent({
					name: name.trim(),
					classCode
				});
				setLaunching(false);
				setSending(false);
			}, 620);
		} catch (error) {
			setSending(false);
			toast.error(error instanceof Error ? error.message : "Could not send this yet.");
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "success-pop overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col items-center gap-4 px-6 py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold tracking-tight",
						children: "It landed."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-sm text-sm text-muted-foreground",
						children: [
							sent.name,
							", your ",
							sent.classCode,
							" work is on the teacher desk."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => {
						setSent(null);
						setName("");
						setClassCode("");
						setSubject("");
						setFiles([]);
					},
					children: "Send another"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "New drop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground",
					children: greeting
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5",
					"aria-label": `${stepsDone} of 3 ready`,
					children: [
						1,
						2,
						3
					].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-7 rounded-full transition-colors duration-200 ${stepsDone >= step ? "bg-primary" : "bg-muted"}` }, step))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "student-name",
								children: "Your name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "student-name",
								name: "student-name",
								autoComplete: "name",
								placeholder: "Adaeze Okonkwo",
								value: name,
								maxLength: 80,
								disabled: sending,
								onChange: (event) => setName(event.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "class-code",
								children: "Class"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classCode,
								onValueChange: (value) => setClassCode(value),
								disabled: sending,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "class-code",
									"aria-label": "Class",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick SS1, SS2, or SS3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CLASS_CODES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: code,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex min-w-10 justify-center rounded-sm bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground",
											children: code
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CLASS_LABELS[code] })]
									})
								}, code)) })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "subject",
							children: [
								"Assignment title",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal text-muted-foreground",
									children: "(optional)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "subject",
							name: "subject",
							placeholder: "Biology week 4 practical",
							value: subject,
							maxLength: 80,
							disabled: sending,
							onChange: (event) => setSubject(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Files ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-normal text-muted-foreground",
							children: [
								"(",
								files.length,
								"/",
								4,
								")"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDropzone, {
							files,
							onChange: setFiles,
							disabled: sending,
							onError: (message) => toast.error(message)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						className: "w-full sm:w-auto sm:self-end",
						disabled: sending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: launching ? "plane-launch" : void 0 }), sending ? "Sending…" : "Send it flying"]
					})
				]
			})]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { current: "submit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "reveal flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex w-fit items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-(--shadow-border)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), "Assignment drop"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight sm:text-4xl",
						children: "Done with it? Send it flying."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-base text-muted-foreground",
						children: "Type your name, pick your class, and drop the files. Your teacher will find them on the desk."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reveal reveal-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignmentForm, {})
			})]
		})]
	});
}
//#endregion
export { Home as component };
