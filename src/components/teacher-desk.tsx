import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Inbox, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { CLASS_CODES, CLASS_LABELS, type ClassCode } from "@/lib/classes";
import {
  getSubmissionFile,
  listSubmissionFiles,
  listSubmissions,
  setMarks,
  type SubmissionFileMeta,
  type SubmissionListItem,
} from "@/lib/submissions";
import { formatBytes } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MARK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function base64ToBlob(b64: string, type: string): Blob {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: type || "application/octet-stream" });
}

function isPreviewableType(fileType: string): boolean {
  return (
    fileType.startsWith("image/") ||
    fileType === "application/pdf" ||
    fileType.startsWith("text/")
  );
}

function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function weekKey(d: Date): string {
  return getWeekStart(d).toISOString().slice(0, 10);
}

function formatWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
  return `Week of ${fmt.format(start)} – ${fmt.format(end)}`;
}

export function TeacherDesk() {
  const [rows, setRows] = useState<SubmissionListItem[] | null>(null);
  const [filter, setFilter] = useState<ClassCode | "all">("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [files, setFiles] = useState<Record<number, SubmissionFileMeta[]>>({});
  const [loadingFiles, setLoadingFiles] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState<number | null>(null);
  const [savingMarks, setSavingMarks] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSubmissions()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setRows([]);
          toast.error(error instanceof Error ? error.message : "Could not load the desk.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (!rows) return [];
    if (filter === "all") return rows;
    return rows.filter((row) => row.classCode === filter);
  }, [rows, filter]);

  const weeks = useMemo(() => {
    const map = new Map<string, { start: Date; rows: SubmissionListItem[] }>();
    for (const row of visible) {
      const d = new Date(row.createdAt);
      const key = weekKey(d);
      if (!map.has(key)) map.set(key, { start: getWeekStart(d), rows: [] });
      map.get(key)!.rows.push(row);
    }
    return Array.from(map.values()).sort((a, b) => b.start.getTime() - a.start.getTime());
  }, [visible]);

  const counts = useMemo(() => {
    const next: Record<string, number> = { all: rows?.length ?? 0 };
    for (const code of CLASS_CODES) next[code] = 0;
    for (const row of rows ?? []) {
      next[row.classCode] = (next[row.classCode] ?? 0) + 1;
    }
    return next;
  }, [rows]);

  async function toggleFiles(id: number) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (files[id]) return;
    setLoadingFiles(id);
    try {
      const list = await listSubmissionFiles({ data: { submissionId: id } });
      setFiles((prev) => ({ ...prev, [id]: list }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open files.");
    } finally {
      setLoadingFiles(null);
    }
  }

  async function downloadFile(fileId: number, fileName: string) {
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

  async function viewFile(fileId: number, fileName: string) {
    setPreviewing(fileId);
    try {
      const file = await getSubmissionFile({ data: { fileId } });
      const blob = base64ToBlob(file.fileData, file.fileType);
      const url = URL.createObjectURL(blob);
      if (isPreviewableType(file.fileType)) {
        window.open(url, "_blank", "noopener");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        toast.info("This file type can't preview in-browser — downloading instead.");
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName || fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open file.");
    } finally {
      setPreviewing(null);
    }
  }

  async function handleSetMarks(submissionId: number, marks: number) {
    setSavingMarks(submissionId);
    try {
      await setMarks({ data: { submissionId, marks } });
      setRows((prev) =>
        prev ? prev.map((row) => (row.id === submissionId ? { ...row, marks } : row)) : prev,
      );
      toast.success(`Marked ${marks}/10.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save marks.");
    } finally {
      setSavingMarks(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All classes"
          count={counts.all ?? 0}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {CLASS_CODES.map((code) => (
          <FilterChip
            key={code}
            label={code}
            count={counts[code] ?? 0}
            active={filter === code}
            onClick={() => setFilter(code)}
          />
        ))}
      </div>

      {rows === null ? (
        <Card>
          <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Opening the desk…
          </CardContent>
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
              <Inbox className="size-5" />
            </span>
            <div>
              <p className="font-medium">No papers yet</p>
              <p className="text-sm text-muted-foreground">
                When students send work, it lands here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {weeks.map((week) => (
            <section key={week.start.toISOString()} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {formatWeekLabel(week.start)}
              </h2>
              <ul className="flex flex-col gap-3">
                {week.rows.map((row) => {
                  const open = openId === row.id;
                  return (
                    <li key={row.id}>
                      <Card>
                        <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-base font-semibold">
                                  {row.studentName}
                                </p>
                                <Badge variant="secondary">{row.classCode}</Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {row.subject ? row.subject : "Untitled drop"}
                                <span className="mx-1.5 text-border">·</span>
                                <span className="tabular-nums">{formatWhen(row.createdAt)}</span>
                                <span className="mx-1.5 text-border">·</span>
                                {row.fileCount} {row.fileCount === 1 ? "file" : "files"}
                              </p>
                              <p className="mt-1 font-mono text-xs text-muted-foreground">
                                {row.assignmentId}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select
                                value={row.marks ? String(row.marks) : undefined}
                                onValueChange={(value) =>
                                  void handleSetMarks(row.id, Number(value))
                                }
                                disabled={savingMarks === row.id}
                              >
                                <SelectTrigger className="w-24" aria-label="Marks">
                                  <SelectValue placeholder="Mark" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MARK_OPTIONS.map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                      {n}/10
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => void toggleFiles(row.id)}
                              >
                                {open ? "Hide files" : "Open files"}
                              </Button>
                            </div>
                          </div>
                          {open ? (
                            <div className="rounded-md bg-secondary/60 p-2">
                              {loadingFiles === row.id ? (
                                <p className="px-2 py-3 text-sm text-muted-foreground">
                                  Loading files…
                                </p>
                              ) : (
                                <ul className="flex flex-col gap-1">
                                  {(files[row.id] ?? []).map((file) => (
                                    <li
                                      key={file.id}
                                      className="flex items-center justify-between gap-3 rounded-sm px-2 py-2"
                                    >
                                      <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium">
                                          {file.fileName}
                                        </span>
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                          {formatBytes(file.fileSize)}
                                        </span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          disabled={previewing === file.id}
                                          onClick={() => void viewFile(file.id, file.fileName)}
                                        >
                                          <Eye className="size-4" />
                                          {previewing === file.id ? "Opening" : "View"}
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          disabled={downloading === file.id}
                                          onClick={() => void downloadFile(file.id, file.fileName)}
                                        >
                                          <Download className="size-4" />
                                          {downloading === file.id ? "Saving" : "Download"}
                                        </Button>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      {filter !== "all" ? (
        <p className="text-xs text-muted-foreground">{CLASS_LABELS[filter]} only.</p>
      ) : null}
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors duration-150 ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card text-foreground shadow-(--shadow-border) hover:shadow-(--shadow-border-hover)"
      }`}
    >
      {label}
      <span
        className={`tabular-nums ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {count}
      </span>
    </button>
  );
}
