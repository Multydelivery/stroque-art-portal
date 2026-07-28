"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { projectSchema } from "@/lib/validation";
import type { Project } from "@/types/entities";

type Values = z.infer<typeof projectSchema>;

export function BusinessProjectDetailsForm({
  project,
  mode = "create"
}: {
  project?: Project | null;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm<Values>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      spaceType: project?.spaceType ?? "Hotel lobby feature wall",
      budgetMin: project?.budgetMin ?? 2500,
      budgetMax: project?.budgetMax ?? 5000,
      timeline: project?.timeline ?? "6-8 weeks",
      dueDate: project?.dueDate ?? "",
      stylePreference: project?.stylePreference ?? "Warm botanical mural with contemporary details",
      description:
        project?.description ??
        "This is a hospitality lobby focal piece designed to increase visual impact and photo moments. Installation support is needed."
    }
  });

  async function onSubmit(values: Values) {
    setServerError("");
    const isEdit = mode === "edit" && project?._id;
    const response = await fetch(isEdit ? `/api/projects/${project._id}` : "/api/projects", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = await response.json();
      setServerError(data.error || "Could not save project.");
      return;
    }

    const data = await response.json();
    router.push(`/dashboard/business/project/artists?projectId=${data.project._id}`);
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="spaceType">Project name or space type</label>
        <input id="spaceType" placeholder="Restaurant mural, lobby sculpture, office gallery wall" {...form.register("spaceType")} />
        <p className="error">{form.formState.errors.spaceType?.message}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="budgetMin">Pay range minimum (USD)</label>
          <input id="budgetMin" min={1} type="number" {...form.register("budgetMin")} />
          <p className="error">{form.formState.errors.budgetMin?.message}</p>
        </div>
        <div className="field">
          <label htmlFor="budgetMax">Pay range maximum (USD)</label>
          <input id="budgetMax" min={1} type="number" {...form.register("budgetMax")} />
          <p className="error">{form.formState.errors.budgetMax?.message}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="stylePreference">Type of art needed</label>
          <input id="stylePreference" placeholder="Abstract mural, portrait series, mixed-media wall" {...form.register("stylePreference")} />
          <p className="error">{form.formState.errors.stylePreference?.message}</p>
        </div>
        <div className="field">
          <label htmlFor="timeline">Timeline</label>
          <select id="timeline" {...form.register("timeline")}>
            <option value="">Select timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="4-6 weeks">4-6 weeks</option>
            <option value="6-8 weeks">6-8 weeks</option>
            <option value="2-3 months">2-3 months</option>
            <option value="Flexible">Flexible</option>
          </select>
          <p className="error">{form.formState.errors.timeline?.message}</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="dueDate">Project due date</label>
        <input id="dueDate" type="date" {...form.register("dueDate")} />
        <p className="error">{form.formState.errors.dueDate?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="description">Project details</label>
        <textarea
          id="description"
          placeholder="Describe goals, audience, constraints, installation requirements, and approvals."
          rows={6}
          {...form.register("description")}
        />
        <p className="error">{form.formState.errors.description?.message}</p>
      </div>

      {serverError && <p className="error">{serverError}</p>}
      <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting
          ? mode === "edit"
            ? "Saving project..."
            : "Posting project..."
          : mode === "edit"
            ? "Save project and continue"
            : "Post project and continue"}
      </button>
    </form>
  );
}