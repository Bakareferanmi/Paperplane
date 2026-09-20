import { useState, type FormEvent } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { CLASS_LABELS, isClassCode } from "@/lib/classes";
import { lookupSubmission } from "@/lib/submissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LookupResult = {
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

export function CheckMarks() {
  const [assignmentId, setAssignmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignmentId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await lookupSubmission({ data: { assignmentId: assignmentId.trim() } });
      setResult(data);
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
            <Label htmlFor="assignment-id">Your assignment ID</Label>
            <Input
              id="assignment-id"
              placeholder="BAKARE12345"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              maxLength={20}
              className="font-mono uppercase"
            />
          </div>
          <Button type="submit" disabled={loading} className="sm:mb-0">
            <Search className="size-4" />
            {loading ? "Checking…" : "Check"}
          </Button>
        </form>

        {result ? (
          <div className="flex flex-col gap-3 rounded-lg bg-secondary/60 p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="font-medium">{result.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {isClassCode(result.classCode) ? CLASS_LABELS[result.classCode] : result.classCode}
                  <span className="mx-1.5">·</span>
                  {result.subject || "Untitled drop"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted {formatWhen(result.createdAt)}
            </p>
            <div className="flex items-center justify-between rounded-md bg-card px-3 py-2 shadow-(--shadow-border)">
              <span className="text-sm font-medium">Marks</span>
              <span className="text-lg font-semibold tabular-nums">
                {result.marks !== null ? `${result.marks}/10` : "Not marked yet"}
              </span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
