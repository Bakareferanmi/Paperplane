import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CheckMarks } from "@/components/check-marks";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/check")({ component: CheckPage });

function CheckPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader current="submit" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="reveal flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-(--shadow-border)">
            <Search className="size-3.5" />
            Check your marks
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How'd it land?
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Enter your Assignment ID to check one drop, or your Student ID to see your full history.
          </p>
        </section>
        <div className="reveal reveal-2">
          <CheckMarks />
        </div>
      </main>
    </div>
  );
}
