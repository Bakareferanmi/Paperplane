import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { TeacherDesk } from "@/components/teacher-desk";
import { SignInGate, SignInButtons } from "@/lib/auth/gates";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader current="desk" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="reveal flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Teacher desk</h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Every paper students send lands here. Open a drop to download the files.
          </p>
          <Link
            to="/students"
            className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View student ID roster →
          </Link>
        </section>
        <div className="reveal reveal-2">
          <SignInGate
            fallback={
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to view student submissions.
                </p>
                <SignInButtons />
              </div>
            }
          >
            <TeacherDesk />
          </SignInGate>
        </div>
      </main>
    </div>
  );
}
