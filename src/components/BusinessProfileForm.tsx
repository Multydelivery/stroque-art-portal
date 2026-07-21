"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { businessProfileSchema, indianaBusinessLocations } from "@/lib/validation";
import type { BusinessProfile } from "@/types/entities";

type Values = z.infer<typeof businessProfileSchema>;

export function BusinessProfileForm({ profile }: { profile: BusinessProfile | null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: profile ?? {
      businessName: "",
      industry: "",
      location: "Indianapolis, IN"
    }
  });

  async function onSubmit(values: Values) {
    const response = await fetch("/api/business/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    setMessage(response.ok ? "Business profile saved." : "Could not save profile.");
    router.refresh();
  }

  return (
    <form className="grid gap-5 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="field">
        <label>Business name</label>
        <input {...form.register("businessName")} />
        <p className="error">{form.formState.errors.businessName?.message}</p>
      </div>
      <div className="field">
        <label>Industry</label>
        <input {...form.register("industry")} />
        <p className="error">{form.formState.errors.industry?.message}</p>
      </div>
      <div className="field">
        <label>Location</label>
        <select {...form.register("location")}>
          {indianaBusinessLocations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <p className="error">{form.formState.errors.location?.message}</p>
      </div>
      <div className="md:col-span-3">
        {message && <p className="mb-3 text-sm text-stone-700">{message}</p>}
        <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save business profile
        </button>
      </div>
    </form>
  );
}
