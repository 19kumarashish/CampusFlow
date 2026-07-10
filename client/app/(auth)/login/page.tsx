import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 overflow-hidden">
      {/* Dynamic line grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] dark:opacity-[0.03]" />
      
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}