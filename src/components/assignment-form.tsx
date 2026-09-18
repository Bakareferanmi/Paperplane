import { useMemo, useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import { CLASS_CODES, CLASS_LABELS, type ClassCode } from "@/lib/classes";
import { createSubmission } from "@/lib/submissions";
import { MAX_FILES } from "@/lib/upload-rules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone, type PickedFile } from "@/components/file-dropzone";

function firstName(full: string): string {
  const part = full.trim().split(/\s+/)[0] ?? "";
  return part;
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function AssignmentForm() {
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useState<ClassCode | "">("");
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ name: string; classCode: ClassCode } | null>(
    null,
  );
  const [launching, setLaunching] = useState(false);

  const greeting = useMemo(() => {
    const nick = firstName(name);
    if (nick.length >= 2) return `Ready when you are, ${nick}.`;
    return "Fill this in, attach your work, and send it flying.";
  }, [name]);

  const stepsDone =
    (name.trim().length >= 2 ? 1 : 0) + (classCode ? 1 : 0) + (files.length > 0 ? 1 : 0);

  async function handleSubmit(event: FormEvent) {
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
      const encoded = await Promise.all(
        files.map(async (item) => ({
          fileName: item.name,
          fileType: item.type,
          fileSize: item.size,
          fileData: await readAsBase64(item.file),
        })),
      );
      await createSubmission({
        data: {
          studentName: name.trim(),
          classCode,
          subject: subject.trim(),
          files: encoded,
        },
      });
      setLaunching(true);
      window.setTimeout(() => {
        setSent({ name: name.trim(), classCode });
        setLaunching(false);
        setSending(false);
      }, 620);
    } catch (error) {
      setSending(false);
      toast.error(error instanceof Error ? error.message : "Could not send this yet.");
    }
  }

  if (sent) {
    return (
      <Card className="success-pop overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Check className="size-7" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">It landed.</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {sent.name}, your {sent.classCode} work is on the teacher desk.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSent(null);
              setName("");
              setClassCode("");
              setSubject("");
              setFiles([]);
            }}
          >
            Send another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              New drop
            </p>
            <p className="text-sm text-foreground">{greeting}</p>
          </div>
          <div className="flex items-center gap-1.5" aria-label={`${stepsDone} of 3 ready`}>
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-1.5 w-7 rounded-full transition-colors duration-200 ${
                  stepsDone >= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="student-name">Your name</Label>
              <Input
                id="student-name"
                name="student-name"
                autoComplete="name"
                placeholder="Adaeze Okonkwo"
                value={name}
                maxLength={80}
                disabled={sending}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="class-code">Class</Label>
              <Select
                value={classCode}
                onValueChange={(value) => setClassCode(value as ClassCode)}
                disabled={sending}
              >
                <SelectTrigger id="class-code" aria-label="Class">
                  <SelectValue placeholder="Pick SS1, SS2, or SS3" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      <span className="flex items-center gap-2">
                        <span className="inline-flex min-w-10 justify-center rounded-sm bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {code}
                        </span>
                        <span>{CLASS_LABELS[code]}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">
              Assignment title{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Biology week 4 practical"
              value={subject}
              maxLength={80}
              disabled={sending}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Files <span className="font-normal text-muted-foreground">({files.length}/{MAX_FILES})</span>
            </Label>
            <FileDropzone
              files={files}
              onChange={setFiles}
              disabled={sending}
              onError={(message) => toast.error(message)}
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-end" disabled={sending}>
            <Send className={launching ? "plane-launch" : undefined} />
            {sending ? "Sending…" : "Send it flying"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
