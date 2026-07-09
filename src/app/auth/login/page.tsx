import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-stone-600">Open your dashboard and continue managing projects.</p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <p className="mt-5 text-sm text-stone-600">
          New to Stroque? <Link className="font-semibold text-ink underline" href="/auth/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
