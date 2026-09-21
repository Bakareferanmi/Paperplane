import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { CLASS_CODES, CLASS_LABELS, type ClassCode } from "@/lib/classes";
import { listStudents, type StudentListItem } from "@/lib/submissions";
import { Card, CardContent } from "@/components/ui/card";

export function StudentRoster() {
  const [rows, setRows] = useState<StudentListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listStudents()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setRows([]);
          toast.error(error instanceof Error ? error.message : "Could not load students.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<ClassCode | "other", StudentListItem[]>();
    for (const row of rows ?? []) {
      const key = (CLASS_CODES as readonly string[]).includes(row.classCode)
        ? (row.classCode as ClassCode)
        : "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    }
    return map;
  }, [rows]);

  if (rows === null) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Loading students…
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
            <Users className="size-5" />
          </span>
          <div>
            <p className="font-medium">No students yet</p>
            <p className="text-sm text-muted-foreground">
              Profiles appear here once students start submitting.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {CLASS_CODES.filter((code) => grouped.has(code)).map((code) => (
        <section key={code} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{CLASS_LABELS[code]}</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {grouped.get(code)!.map((student) => (
                  <li
                    key={student.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="truncate text-sm font-medium">{student.studentName}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {student.studentId}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      ))}
      {grouped.has("other") ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Other</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {grouped.get("other")!.map((student) => (
                  <li
                    key={student.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="truncate text-sm font-medium">{student.studentName}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {student.studentId}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
