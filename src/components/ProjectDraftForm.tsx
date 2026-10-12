"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { currency } from "@/lib/format";
import {
  maxProjectReferenceBytes,
  maxProjectReferenceFiles,
  projectCategories,
  projectDraftSchema,
  projectReferenceMimeTypes
} from "@/lib/validation";
import type { Project } from "@/types/entities";

type Values = z.infer<typeof projectDraftSchema>;

const savedDraftSchema = z.object({ project: z.object({ _id: z.string().min(1), status: z.literal("draft") }) });
const uploadSchema = z.object({ url: projectDraftSchema.shape.referenceFiles.removeDefault().element.shape.url });
const timelineOptions = ["ASAP", "2-4 weeks", "4-6 weeks", "6-8 weeks", "2-3 months", "Flexible"];

export function ProjectDraftForm({ project }: { project?: Project | null }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [review, setReview] = useState<Values | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(projectDraftSchema),
    defaultValues: {
      spaceType: project?.spaceType ?? "",
      category: projectCategories.find((category) => category === project?.category),
      description: project?.description ?? "",
      deliverables: project?.deliverables ?? "",
      dimensions: project?.dimensions ?? "",
      timeline: project?.timeline ?? "",
      dueDate: project?.dueDate ?? "",
      budget: project?.budget,
      paymentStructure: "fixed",
      specialRequirements: project?.specialRequirements ?? "",
      stylePreference: project?.stylePreference ?? "",
      artistExperience: project?.artistExperience ?? "",
      referenceFiles: project?.referenceFiles ?? []
    }
  });
  const referenceFiles = form.watch("referenceFiles");
  const busy = uploading || form.formState.isSubmitting;

  async function uploadReferences(files: File[]) {
    setError("");
    if (form.getValues("referenceFiles").length + files.length > maxProjectReferenceFiles) {
      setError(`Add no more than ${maxProjectReferenceFiles} reference files.`);
      return;
    }
    if (files.some((file) => !projectReferenceMimeTypes.includes(file.type) || file.size === 0 || file.size > maxProjectReferenceBytes)) {
      setError("Use JPG, PNG, WebP, GIF, or PDF files up to 10 MB each. Empty files are not accepted.");
      return;
    }
    setUploading(true);
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        body.append("purpose", "project-reference");
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) {
          setError(typeof data.error === "string" ? data.error : `Could not upload ${file.name}. Please try again.`);
          return;
        }
        const parsed = uploadSchema.safeParse(data);
        if (!parsed.success) {
          setError(`Upload did not return a valid URL for ${file.name}. Please try again.`);
          return;
        }
        form.setValue("referenceFiles", [...form.getValues("referenceFiles"), { name: file.name, url: parsed.data.url }], {
          shouldDirty: true, shouldValidate: true
        });
      }
    } catch {
      setError("Could not upload the reference files. Please check your connection and try again. Any files already uploaded remain listed.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: Values) {
    setError("");
    if (!review) {
      setReview(values);
      return;
    }
    try {
      const response = await fetch(project ? `/api/projects/${project._id}` : "/api/projects", {
        method: project ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save draft. Check your project details and try again.");
        return;
      }
      if (!savedDraftSchema.safeParse(data).success) {
        setError("The server did not confirm a saved draft. Please check My Projects before trying again.");
        return;
      }
      router.push("/dashboard/business?tab=posted-projects&saved=draft");
      router.refresh();
    } catch {
      setError("Could not confirm the saved draft. Please check your connection and My Projects before trying again.");
    }
  }

  const buttonClasses = "rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60";

  return (
    <form className="mt-6 space-y-5" aria-busy={busy} onSubmit={form.handleSubmit(onSubmit)}>
      {review ? (
        <section aria-labelledby="draft-review-title" className="space-y-5 rounded-lg bg-stone-50 p-5 dark:bg-white/5">
          <h3 id="draft-review-title" className="text-xl font-semibold">Review project draft</h3>
          <p className="text-sm">Saving a draft does not publish your project or contact artists.</p>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="font-semibold">Project title</dt><dd>{review.spaceType}</dd></div>
            <div><dt className="font-semibold">Category</dt><dd>{review.category}</dd></div>
            <div><dt className="font-semibold">Budget (USD)</dt><dd>{currency(review.budget, 2)}</dd></div>
            <div><dt className="font-semibold">Payment structure</dt><dd>Fixed price</dd></div>
            <div><dt className="font-semibold">Timeline</dt><dd>{review.timeline}</dd></div>
            <div><dt className="font-semibold">Due date</dt><dd>{review.dueDate}</dd></div>
            <div><dt className="font-semibold">Dimensions</dt><dd>{review.dimensions || "Not specified"}</dd></div>
            <div><dt className="font-semibold">Preferred artist experience</dt><dd className="whitespace-pre-wrap">{review.artistExperience || "Not specified"}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">Description</dt><dd className="whitespace-pre-wrap break-words">{review.description}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">Deliverables</dt><dd className="whitespace-pre-wrap break-words">{review.deliverables}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">Special requirements</dt><dd className="whitespace-pre-wrap break-words">{review.specialRequirements || "None specified"}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">Preferred artist style</dt><dd className="whitespace-pre-wrap break-words">{review.stylePreference || "No preference"}</dd></div>
          </dl>
          <div>
            <h4 className="font-semibold">Reference files</h4>
            {review.referenceFiles.length ? (
              <ul className="mt-2 space-y-2">
                {review.referenceFiles.map((file, index) => (
                  <li key={`${file.url}-${index}`}><a className="break-words underline" href={file.url} target="_blank" rel="noreferrer">{file.name}</a></li>
                ))}
              </ul>
            ) : <p>No reference files added.</p>}
          </div>
        </section>
      ) : (
        <fieldset disabled={busy} className="space-y-5">
          <legend className="sr-only">Project draft details</legend>
          <div className="field">
            <label htmlFor="spaceType">Project title (required)</label>
            <input id="spaceType" placeholder="Restaurant mural, lobby sculpture, digital artwork" {...form.register("spaceType")} />
            <p className="error">{form.formState.errors.spaceType?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="category">Project category (required)</label>
            <select id="category" {...form.register("category")}>
              <option value="">Select category</option>
              {projectCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <p className="error">{form.formState.errors.category?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="description">Detailed project description (required)</label>
            <textarea id="description" rows={5} placeholder="Explain your goals, audience, scope, and requested work." {...form.register("description")} />
            <p className="error">{form.formState.errors.description?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="referenceFiles">Reference files/images (optional)</label>
            <input id="referenceFiles" type="file" multiple accept={projectReferenceMimeTypes.join(",")} onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (files.length) void uploadReferences(files);
            }} />
            <p className="text-xs text-stone-600 dark:text-stone-300">Up to 8 JPG, PNG, WebP, GIF, or PDF files, 10 MB each.</p>
            {uploading && <p role="status">Uploading reference files...</p>}
            <p className="error">{form.formState.errors.referenceFiles?.message}</p>
            <ul className="space-y-2">
              {referenceFiles.map((file, index) => (
                <li key={`${file.url}-${index}`} className="flex items-center justify-between gap-3">
                  <a className="break-words underline" href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                  <button type="button" className="text-sm font-semibold underline" aria-label={`Remove ${file.name}`} onClick={() => {
                    form.setValue("referenceFiles", referenceFiles.filter((_, itemIndex) => index !== itemIndex), { shouldDirty: true, shouldValidate: true });
                  }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="field">
            <label htmlFor="deliverables">Project deliverables (required)</label>
            <textarea id="deliverables" rows={4} placeholder="List the artwork, files, installation, or other outputs the artist must deliver." {...form.register("deliverables")} />
            <p className="error">{form.formState.errors.deliverables?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="dimensions">Dimensions (optional)</label>
            <input id="dimensions" placeholder="Include measurements and units, if applicable." {...form.register("dimensions")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="timeline">Expected timeline (required)</label>
              <select id="timeline" {...form.register("timeline")}>
                <option value="">Select timeline</option>
                {timelineOptions.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
                {project?.timeline && !timelineOptions.includes(project.timeline) && <option value={project.timeline}>{project.timeline}</option>}
              </select>
              <p className="error">{form.formState.errors.timeline?.message}</p>
            </div>
            <div className="field">
              <label htmlFor="dueDate">Project due date (required)</label>
              <input id="dueDate" type="date" {...form.register("dueDate")} />
              <p className="error">{form.formState.errors.dueDate?.message}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="budget">Project budget (USD, required)</label>
              <input id="budget" type="number" min={100} max={10000} step="0.01" {...form.register("budget")} />
              <p className="text-xs text-stone-600 dark:text-stone-300">Fixed project budget: $100-$10,000 USD.</p>
              <p className="error">{form.formState.errors.budget?.message}</p>
            </div>
            <div className="field">
              <label htmlFor="paymentStructure">Payment structure</label>
              <select id="paymentStructure" {...form.register("paymentStructure")}><option value="fixed">Fixed price</option></select>
              <p className="error">{form.formState.errors.paymentStructure?.message}</p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="specialRequirements">Special requirements (optional)</label>
            <textarea id="specialRequirements" rows={3} placeholder="Site access, installation, approvals, accessibility, or other constraints." {...form.register("specialRequirements")} />
          </div>
          <div className="field">
            <label htmlFor="stylePreference">Preferred artist style (optional)</label>
            <input id="stylePreference" placeholder="Botanical, contemporary, minimalist..." {...form.register("stylePreference")} />
          </div>
          <div className="field">
            <label htmlFor="artistExperience">Preferred artist experience (optional)</label>
            <textarea id="artistExperience" rows={2} placeholder="Experience with hospitality murals, outdoor installations..." {...form.register("artistExperience")} />
          </div>
        </fieldset>
      )}
      {error && <p role="alert" className="error">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {review && (
          <button type="button" disabled={busy} className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold disabled:opacity-60 dark:border-white/20" onClick={() => {
            setReview(null);
            setError("");
          }}>Edit project details</button>
        )}
        <button className={buttonClasses} type="submit" disabled={busy}>
          {form.formState.isSubmitting ? "Saving draft..." : review ? "Save Draft" : "Review project"}
        </button>
      </div>
    </form>
  );
}
