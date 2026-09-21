import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { SignInGate, SignInButtons } from "@/lib/auth/gates";
import { SiteHeader } from "@/components/site-header";
import { StudentRoster } from "@/components/student-roster";

export const Route = createFileRoute("/students")({ component: StudentsPage });

function StudentsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="reveal flex flex-col gap-2">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-(--shadow-border)">
            <Users className="size-3.5" />
            Student IDs
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Class roster</h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Every student's ID, grouped by class — hand it back if someone forgets theirs.
          </p>
        </section>
        <div className="reveal reveal-2">
          <SignInGate
            fallback={
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to view the class roster.
                </p>
                <SignInButtons />
              </div>
            }
          >
            <StudentRoster />
          </SignInGate>
        </div>
      </main>
    </div>
  );
}
