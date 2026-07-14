"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, signupSchema } from "@/lib/validation";

type Mode = "login" | "signup";
type AuthValues = {
  name?: string;
  email: string;
  password: string;
  role?: "artist" | "business";
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const isSignup = mode === "signup";
  const schema = isSignup ? signupSchema : loginSchema;
  const form = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: isSignup
      ? { name: "", email: "", password: "", role: "business" }
      : { email: "", password: "" }
  });

  async function onSubmit(values: AuthValues) {
    setServerError("");
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await response.json();

    if (!response.ok) {
      setServerError(typeof data.error === "string" ? data.error : "Please check the form and try again.");
      return;
    }

    const dashboard = data.role === "admin" ? "/dashboard/admin" : `/dashboard/${data.role}`;
    router.push(dashboard);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      {isSignup && (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" {...form.register("name")} />
          <p className="error">{form.formState.errors.name?.message}</p>
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...form.register("email")} />
        <p className="error">{form.formState.errors.email?.message}</p>
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...form.register("password")} />
        <p className="error">{form.formState.errors.password?.message}</p>
      </div>
      {isSignup && (
        <div className="field">
          <label htmlFor="role">I am joining as</label>
          <select id="role" {...form.register("role")}>
            <option value="business">Business</option>
            <option value="artist">Artist</option>
          </select>
        </div>
      )}
      {serverError && <p className="error">{serverError}</p>}
      <button className="w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? "Working..." : isSignup ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
