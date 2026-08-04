"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { projectSchema } from "@/lib/validation";
import type { Project } from "@/types/entities";

type Values = z.infer<typeof projectSchema>;

const payRangePresets = [
  { value: "1500-3000", label: "$1,500 - $3,000", budgetMin: 1500, budgetMax: 3000 },
  { value: "3000-6000", label: "$3,000 - $6,000", budgetMin: 3000, budgetMax: 6000 },
  { value: "6000-10000", label: "$6,000 - $10,000", budgetMin: 6000, budgetMax: 10000 },
  { value: "10000-20000", label: "$10,000 - $20,000", budgetMin: 10000, budgetMax: 20000 }
] as const;

const artTypeOptions = [
  "Mural",
  "Canvas painting",
  "Digital illustration",
  "Sculpture",
  "Mixed media",
  "Installation art",
  "Portrait",
  "Abstract"
] as const;

const timelineOptions = ["ASAP", "2-4 weeks", "4-6 weeks", "6-8 weeks", "2-3 months", "Flexible"] as const;

export function BusinessProjectDetailsForm({
  project,
  mode = "create"
}: {
  project?: Project | null;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [defaultHeight, defaultWidth] = (project?.dimensions || "").toLowerCase().split("x");
  const matchedPreset = payRangePresets.find(
    (preset) => preset.budgetMin === project?.budgetMin && preset.budgetMax === project?.budgetMax
  );
  const [payRangePreset, setPayRangePreset] = useState(matchedPreset?.value ?? "");
  const [height, setHeight] = useState(defaultHeight && Number(defaultHeight) >= 5 && Number(defaultHeight) <= 50 ? defaultHeight : "10");
  const [width, setWidth] = useState(defaultWidth && Number(defaultWidth) >= 5 && Number(defaultWidth) <= 50 ? defaultWidth : "20");

  const form = useForm<Values>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      spaceType: project?.spaceType ?? "",
      dimensions: project?.dimensions ?? "10x20",
      budgetMin: project?.budgetMin,
      budgetMax: project?.budgetMax,
      timeline: project?.timeline ?? "",
      dueDate: project?.dueDate ?? "",
      stylePreference: project?.stylePreference ?? "",
      description: project?.description ?? ""
    }
  });

  function onDimensionChange(nextHeight: string, nextWidth: string) {
    setHeight(nextHeight);
    setWidth(nextWidth);
    form.setValue("dimensions", `${nextHeight}x${nextWidth}`, { shouldDirty: true, shouldValidate: true });
  }

  function onPayRangePresetChange(value: string) {
    setPayRangePreset(value);
    if (!value) return;

    const selected = payRangePresets.find((preset) => preset.value === value);
    if (!selected) return;

    form.setValue("budgetMin", selected.budgetMin, { shouldDirty: true, shouldValidate: true });
    form.setValue("budgetMax", selected.budgetMax, { shouldDirty: true, shouldValidate: true });
  }

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
          <label htmlFor="projectHeight">Project height</label>
          <select id="projectHeight" value={height} onChange={(event) => onDimensionChange(event.target.value, width)}>
            {Array.from({ length: 46 }, (_, index) => index + 5).map((size) => (
              <option key={`h-${size}`} value={String(size)}>{size}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="projectWidth">Project width</label>
          <select id="projectWidth" value={width} onChange={(event) => onDimensionChange(height, event.target.value)}>
            {Array.from({ length: 46 }, (_, index) => index + 5).map((size) => (
              <option key={`w-${size}`} value={String(size)}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="dimensionsPreview">Dimensions</label>
        <input id="dimensionsPreview" readOnly value={`${height}x${width}`} />
        <input type="hidden" {...form.register("dimensions")} />
        <p className="error">{form.formState.errors.dimensions?.message}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="payRangePreset">Pay range preset</label>
          <select id="payRangePreset" onChange={(event) => onPayRangePresetChange(event.target.value)} value={payRangePreset}>
            <option value="">Custom pay range</option>
            {payRangePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>{preset.label}</option>
            ))}
          </select>
        </div>
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
          <select id="stylePreference" {...form.register("stylePreference")}>
            <option value="">Select type of art</option>
            {artTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
            {project?.stylePreference && !artTypeOptions.includes(project.stylePreference as (typeof artTypeOptions)[number]) ? (
              <option value={project.stylePreference}>{project.stylePreference}</option>
            ) : null}
          </select>
          <p className="error">{form.formState.errors.stylePreference?.message}</p>
        </div>
        <div className="field">
          <label htmlFor="timeline">Timeline</label>
          <select id="timeline" {...form.register("timeline")}>
            <option value="">Select timeline</option>
            {timelineOptions.map((timeline) => (
              <option key={timeline} value={timeline}>{timeline}</option>
            ))}
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
            : "Post project details and continue"}
      </button>
    </form>
  );
}