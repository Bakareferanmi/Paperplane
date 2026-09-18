import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Paperclip, Trash2, Upload } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { isAllowedUpload, MAX_FILES, MAX_TOTAL_BYTES } from "@/lib/upload-rules";
import { Button } from "@/components/ui/button";

export type PickedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
};

type FileDropzoneProps = {
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

export function FileDropzone({ files, onChange, onError, disabled }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hot, setHot] = useState(false);

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const next = [...files];
    let used = next.reduce((sum, item) => sum + item.size, 0);

    for (const file of incoming) {
      const reason = isAllowedUpload(file);
      if (reason) {
        onError(reason);
        continue;
      }
      if (next.length >= MAX_FILES) {
        onError(`You can send up to ${MAX_FILES} files.`);
        break;
      }
      if (used + file.size > MAX_TOTAL_BYTES) {
        onError("Keep the whole drop under 8 MB.");
        continue;
      }
      const duplicate = next.some(
        (item) => item.name === file.name && item.size === file.size,
      );
      if (duplicate) continue;
      used += file.size;
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        file,
      });
    }
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setHot(true);
        }}
        onDragLeave={() => setHot(false)}
        onDrop={(event) => {
          event.preventDefault();
          setHot(false);
          if (!disabled && event.dataTransfer.files.length) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg bg-secondary/50 px-4 py-8 text-center shadow-(--shadow-border) transition-[transform,background-color,box-shadow] duration-200 ease-out",
          hot && "drop-hot bg-secondary shadow-(--shadow-border-hover)",
          disabled && "opacity-60",
        )}
      >
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-md bg-card text-primary shadow-(--shadow-border) transition-transform duration-200",
            hot && "scale-105",
          )}
        >
          <Upload className="size-5" />
        </span>
        <p className="text-sm font-medium">Drop your work here</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          PDF, Word, PowerPoint, Excel, images, text, or zip. Up to 4 files, 4 MB each.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="mt-1"
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md bg-card px-3 py-2 shadow-(--shadow-border)"
            >
              <span className="flex size-9 items-center justify-center rounded-sm bg-secondary text-primary">
                {item.type.startsWith("image/") ? (
                  <ImageIcon className="size-4" />
                ) : item.type === "application/pdf" ? (
                  <FileText className="size-4" />
                ) : (
                  <Paperclip className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatBytes(item.size)}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                disabled={disabled}
                aria-label={`Remove ${item.name}`}
                onClick={() => onChange(files.filter((file) => file.id !== item.id))}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
