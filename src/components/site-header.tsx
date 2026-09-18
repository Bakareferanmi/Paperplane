import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <nav className="flex items-center gap-1 rounded-lg bg-secondary/70 p-1">
          <NavLink to="/" active={current === "submit"}>
            Submit
          </NavLink>
          <NavLink to="/desk" active={current === "desk"}>
            Teacher desk
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: "/" | "/desk";
  active: boolean;
  children: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-9 min-h-9 items-center rounded-md px-3 text-sm font-medium no-underline transition-colors duration-150",
        active
          ? "bg-card text-foreground shadow-(--shadow-border)"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
