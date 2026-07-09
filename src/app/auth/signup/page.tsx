import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-stone-600">Choose artist or business during signup.</p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-5 text-sm text-stone-600">
          Already have an account? <Link className="font-semibold text-ink underline" href="/auth/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
