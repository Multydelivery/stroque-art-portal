"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
  const [uploading, setUploading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: profile ?? {
      businessName: "",
      industry: "",
      location: "Indianapolis, IN",
      logoUrl: ""
    }
  });

  async function uploadLogo(file: File) {
    setUploading(true);
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!response.ok) {
      setMessage(data.error || "Upload failed.");
      return;
    }
    form.setValue("logoUrl", data.url, { shouldDirty: true });
    setMessage("Business logo uploaded. Save profile to apply it.");
  }

  async function onSubmit(values: Values) {
    setMessage("");
    const response = await fetch("/api/business/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    setMessage(response.ok ? "Business profile saved." : "Could not save profile.");
    router.refresh();
  }

  const logoUrl = form.watch("logoUrl");

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
      <div className="field md:col-span-3">
        <label>Business profile image</label>
        <input accept="image/*" type="file" onChange={(event) => event.target.files?.[0] && uploadLogo(event.target.files[0])} />
        <p className="text-xs text-stone-600">This image appears in the Business user logo on the dashboard side panel.</p>
        <p className="error">{form.formState.errors.logoUrl?.message}</p>
        {uploading && <p className="text-sm text-stone-600">Uploading...</p>}
        {logoUrl ? (
          <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-stone-200 bg-white">
              <Image src={logoUrl} alt="Business logo preview" fill sizes="48px" className="object-cover" />
            </span>
            <button
              className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
              onClick={() => form.setValue("logoUrl", "", { shouldDirty: true })}
              type="button"
            >
              Remove image
            </button>
          </div>
        ) : null}
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
