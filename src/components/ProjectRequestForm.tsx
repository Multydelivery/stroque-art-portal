"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { projectRequestSchema } from "@/lib/validation";

type Values = z.infer<typeof projectRequestSchema>;

const timelineOptions = ["ASAP", "2-4 weeks", "4-6 weeks", "6-8 weeks", "2-3 months", "Flexible"];

export function ProjectRequestForm({
  artistId,
  demoMode = false,
  stayOnSuccess = false
}: {
  artistId: string;
  demoMode?: boolean;
  stayOnSuccess?: boolean;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      artistId,
      spaceType: demoMode ? "Hotel lobby feature wall" : "",
      budget: demoMode ? 4200 : 2500,
      timeline: demoMode ? "6-8 weeks" : "",
      stylePreference: demoMode ? "Warm botanical mural with contemporary details" : "",
      description: demoMode
        ? "This is a demo request for a lobby artwork concept. The space needs a welcoming focal point that reflects the brand and works well for guest photos."
        : ""
    }
  });

  async function onSubmit(values: Values) {
    setServerError("");
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = await response.json();
      setServerError(data.error || "Could not submit request.");
      return;
    }

    if (stayOnSuccess) {
      setSubmitted(true);
      form.reset(values);
      return;
    }

    router.push("/dashboard/business");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <input type="hidden" {...form.register("artistId")} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label>Space type</label>
          <input placeholder="Restaurant wall, lobby, office suite" {...form.register("spaceType")} />
          <p className="error">{form.formState.errors.spaceType?.message}</p>
        </div>
        <div className="field">
          <label>Budget</label>
          <input type="number" {...form.register("budget")} />
          <p className="error">{form.formState.errors.budget?.message}</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label>Timeline</label>
          <select {...form.register("timeline")}>
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="error">{form.formState.errors.timeline?.message}</p>
        </div>
        <div className="field">
          <label>Style preference</label>
          <input placeholder="Abstract, mural, textile, sculptural" {...form.register("stylePreference")} />
          <p className="error">{form.formState.errors.stylePreference?.message}</p>
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={6} placeholder="Describe the space, audience, goals, constraints, and any installation details." {...form.register("description")} />
        <p className="error">{form.formState.errors.description?.message}</p>
      </div>
      {submitted && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          Demo request submitted. In test mode this is saved in memory until the dev server restarts.
        </p>
      )}
      {serverError && <p className="error">{serverError}</p>}
      <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? "Submitting..." : "Submit project request"}
      </button>
    </form>
  );
}
