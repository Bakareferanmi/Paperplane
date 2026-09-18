import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { AssignmentForm } from "@/components/assignment-form";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader current="submit" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="reveal flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-(--shadow-border)">
            <Send className="size-3.5" />
            Assignment drop
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Done with it? Send it flying.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Type your name, pick your class, and drop the files. Your teacher will find them on
            the desk.
          </p>
        </section>
        <div className="reveal reveal-2">
          <AssignmentForm />
        </div>
      </main>
    </div>
  );
}
