"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProjectCardActions({
  projectId,
  status,
  projectName
}: {
  projectId: string;
  status: "open" | "closed";
  projectName: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus: "open" | "closed") {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      nextStatus === "closed"
        ? `Cancel project \"${projectName}\"? You can reopen it later.`
        : `Reopen project \"${projectName}\"?`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!response.ok) {
        setError("Could not update project status.");
        return;
      }
      setMessage(nextStatus === "closed" ? "Project cancelled." : "Project reopened.");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function removeProject() {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      `Delete project \"${projectName}\"? This will also remove related requests.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        setError("Could not delete project.");
        return;
      }
      setMessage("Project deleted.");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div aria-busy={isLoading} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          aria-label={status === "open" ? `Cancel project ${projectName}` : `Reopen project ${projectName}`}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60 dark:border-white/20 dark:text-stone-100 dark:hover:bg-[#2b2b33] dark:focus-visible:ring-offset-[#121214]"
          disabled={isLoading}
          onClick={() => updateStatus(status === "open" ? "closed" : "open")}
          type="button"
        >
          {status === "open" ? "Cancel project" : "Reopen project"}
        </button>
        <button
          aria-label={`Delete project ${projectName}`}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60 dark:border-red-400/70 dark:text-red-200 dark:hover:bg-red-950/30 dark:focus-visible:ring-offset-[#121214]"
          disabled={isLoading}
          onClick={removeProject}
          type="button"
        >
          Delete project
        </button>
      </div>
      {message ? <p aria-live="polite" className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}