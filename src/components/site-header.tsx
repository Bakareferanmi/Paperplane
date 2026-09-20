import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";

export function SiteHeader({ current }: { current: "submit" | "desk" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground no-underline"
          aria-label="Paperplane home"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Send className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">Paperplane</span>
        </Link>
      </div>
    </header>
  );
}
