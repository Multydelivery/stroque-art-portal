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
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reviewValues, setReviewValues] = useState<Values | null>(null);
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
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Upload failed. Please try again.");
        return;
      }
      const parsedLogo = businessProfileSchema.shape.logoUrl.safeParse(data.url);
      if (!parsedLogo.success || !parsedLogo.data) {
        setError("Upload did not return a valid image URL. Please try again.");
        return;
      }
      form.setValue("logoUrl", parsedLogo.data, { shouldDirty: true, shouldValidate: true });
      setMessage("Business logo uploaded. Review and save your profile to apply it.");
    } catch {
      setError("Could not upload the image. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: Values) {
    setMessage("");
    setError("");
    if (!reviewValues) {
      setReviewValues(values);
      return;
    }

    try {
      const response = await fetch("/api/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewValues)
      });
      if (!response.ok) {
        const data = await response.json();
        setError(typeof data.error === "string" ? data.error : "Could not save profile. Please check your details and try again.");
        return;
      }
      router.push("/dashboard/business/project");
      router.refresh();
    } catch {
      setError("Could not save profile. Please check your connection and try again.");
    }
  }

  const values = form.watch();
  const logoUrl = values.logoUrl;
  const completedFields = [
    businessProfileSchema.shape.businessName.safeParse(values.businessName).success,
    businessProfileSchema.shape.industry.safeParse(values.industry).success,
    businessProfileSchema.shape.location.safeParse(values.location).success
  ].filter(Boolean).length;
  const completion = Math.round((completedFields / 3) * 100);
  const savedProfileComplete = Boolean(profile && businessProfileSchema.safeParse(profile).success);
  const busy = uploading || form.formState.isSubmitting;

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} aria-busy={busy}>
      <section aria-labelledby="profile-completion-title" className="rounded-lg bg-stone-50 p-4 dark:bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="profile-completion-title" className="font-semibold">Profile completion</h3>
          <span className="text-sm">{completion}% ({completedFields} of 3 required fields)</span>
        </div>
        <progress aria-label="Required profile fields completed" className="mt-3 h-2 w-full accent-moss" max={100} value={completion} />
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-200" role="status">
          {form.formState.isDirty
            ? "You have unsaved changes. Review and save to apply them."
            : savedProfileComplete
              ? "Your saved profile has all required information."
              : "Complete the required information, then review and save your profile."}
        </p>
        <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">Business name, industry, and location are required. A company photo or logo is optional.</p>
      </section>
      {reviewValues ? (
        <section aria-labelledby="profile-review-title" className="rounded-lg border border-stone-200 p-5 dark:border-white/20">
          <h3 id="profile-review-title" className="text-lg font-semibold">Review your business profile</h3>
          <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">Confirm your information before saving and continuing to create a project.</p>
          <dl className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Business name</dt>
              <dd className="mt-1 break-words font-semibold">{reviewValues.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Industry</dt>
              <dd className="mt-1 break-words font-semibold">{reviewValues.industry}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Location</dt>
              <dd className="mt-1 font-semibold">{reviewValues.location}</dd>
            </div>
          </dl>
          {reviewValues.logoUrl ? (
            <div className="relative mt-4 h-20 w-20 overflow-hidden rounded-full">
              <Image src={reviewValues.logoUrl} alt="Business logo to save" fill sizes="80px" className="object-cover" />
            </div>
          ) : <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">No company photo or logo added.</p>}
        </section>
      ) : (
        <fieldset className="grid gap-5 md:grid-cols-3" disabled={busy}>
          <legend className="sr-only">Business profile information</legend>
          <div className="field">
            <label htmlFor="businessName">Business name (required)</label>
            <input id="businessName" aria-describedby="business-name-error" aria-invalid={Boolean(form.formState.errors.businessName)} {...form.register("businessName")} />
            <p id="business-name-error" className="error">{form.formState.errors.businessName?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="industry">Industry (required)</label>
            <input id="industry" aria-describedby="industry-error" aria-invalid={Boolean(form.formState.errors.industry)} {...form.register("industry")} />
            <p id="industry-error" className="error">{form.formState.errors.industry?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="businessLocation">Location (required)</label>
            <select id="businessLocation" aria-describedby="location-error" aria-invalid={Boolean(form.formState.errors.location)} {...form.register("location")}>
              {indianaBusinessLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <p id="location-error" className="error">{form.formState.errors.location?.message}</p>
          </div>
          <div className="field md:col-span-3">
            <label htmlFor="businessLogo">Business profile image (optional)</label>
            <input id="businessLogo" accept="image/*" type="file" onChange={(event) => event.target.files?.[0] && uploadLogo(event.target.files[0])} />
            <p className="text-xs text-stone-600 dark:text-stone-300">This image appears in the Business user logo on the dashboard side panel.</p>
            <p className="error">{form.formState.errors.logoUrl?.message}</p>
            {uploading && <p className="text-sm text-stone-600 dark:text-stone-300">Uploading...</p>}
            {logoUrl ? (
              <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/20 dark:bg-[#1f1f26]">
                <span className="relative h-12 w-12 overflow-hidden rounded-full border border-stone-200 bg-white dark:border-white/20 dark:bg-[#262630]">
                  <Image src={logoUrl} alt="Business logo preview" fill sizes="48px" className="object-cover" />
                </span>
                <button
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1f1f26] dark:text-stone-100 dark:hover:bg-[#2b2b33] dark:focus-visible:ring-offset-[#121214]"
                  onClick={() => form.setValue("logoUrl", "", { shouldDirty: true, shouldValidate: true })}
                  type="button"
                >
                  Remove image
                </button>
              </div>
            ) : null}
          </div>
        </fieldset>
      )}
      <div>
        {message && <p role="status" className="mb-3 text-sm text-stone-700 dark:text-stone-200">{message}</p>}
        {error && <p role="alert" className="error mb-3">{error}</p>}
        <div className="flex flex-wrap gap-3">
          {reviewValues && (
            <button
              className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold disabled:opacity-60 dark:border-white/20"
              disabled={busy}
              onClick={() => {
                setReviewValues(null);
                setError("");
              }}
              type="button"
            >
              Edit profile
            </button>
          )}
          <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60 dark:focus-visible:ring-offset-[#121214]" disabled={busy} type="submit">
            {form.formState.isSubmitting ? "Saving..." : reviewValues ? "Save & Continue" : "Review profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
