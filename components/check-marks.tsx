import { useState, type FormEvent } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { CLASS_LABELS, isClassCode } from "@/lib/classes";
import { lookupStudent, lookupSubmission, type StudentProfile } from "@/lib/submissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssignmentResult = {
  assignmentId: string;
  studentName: string;
  classCode: string;
  subject: string;
  createdAt: string;
  marks: number | null;
};

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

function classLabel(code: string): string {
  return isClassCode(code) ? CLASS_LABELS[code] : code;
}

export function CheckMarks() {
  const [queryId, setQueryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResult | null>(null);
  const [studentResult, setStudentResult] = useState<StudentProfile | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = queryId.trim();
    if (!trimmed) return;
    setLoading(true);
    setAssignmentResult(null);
    setStudentResult(null);
    try {
      if (trimmed.toUpperCase().startsWith("BAKARESTU")) {
        const data = await lookupStudent({ data: { studentId: trimmed } });
        setStudentResult(data);
      } else {
        const data = await lookupSubmission({ data: { assignmentId: trimmed } });
        setAssignmentResult(data);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not find that ID.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-5 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="lookup-id">Assignment ID or Student ID</Label>
            <Input
              id="lookup-id"
              placeholder="BAKARE12345 or BAKARESTU12345"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              maxLength={20}
              className="font-mono uppercase"
            />
          </div>
          <Button type="submit" disabled={loading} className="sm:mb-0">
            <Search className="size-4" />
            {loading ? "Checking…" : "Check"}
          </Button>
        </form>

        {assignmentResult ? (
          <div className="flex flex-col gap-3 rounded-lg bg-secondary/60 p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="font-medium">{assignmentResult.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {classLabel(assignmentResult.classCode)}
                  <span className="mx-1.5">·</span>
                  {assignmentResult.subject || "Untitled drop"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted {formatWhen(assignmentResult.createdAt)}
            </p>
            <div className="flex items-center justify-between rounded-md bg-card px-3 py-2 shadow-(--shadow-border)">
              <span className="text-sm font-medium">Marks</span>
              <span className="text-lg font-semibold tabular-nums">
                {assignmentResult.marks !== null ? `${assignmentResult.marks}/10` : "Not marked yet"}
              </span>
            </div>
          </div>
        ) : null}

        {studentResult ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="font-medium">{studentResult.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {classLabel(studentResult.classCode)}
                  <span className="mx-1.5">·</span>
                  {studentResult.submissions.length}{" "}
                  {studentResult.submissions.length === 1 ? "submission" : "submissions"}
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              {studentResult.submissions.map((item) => (
                <li
                  key={item.assignmentId}
                  className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 shadow-(--shadow-border)"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.subject || "Untitled drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatWhen(item.createdAt)}
                      <span className="mx-1.5">·</span>
                      <span className="font-mono">{item.assignmentId}</span>
                    </p>
                  </div>
                  <Badge variant={item.marks !== null ? "default" : "secondary"}>
                    {item.marks !== null ? `${item.marks}/10` : "Not marked"}
                  </Badge>
                </li>
              ))}
              {studentResult.submissions.length === 0 ? (
                <li className="rounded-md bg-secondary/60 px-3 py-3 text-center text-sm text-muted-foreground">
                  No submissions yet.
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
