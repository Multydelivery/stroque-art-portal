"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  async function onCancel() {
    setError("");
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/requests/${requestId}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Could not cancel request.");
        return;
      }

      router.refresh();
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isCancelling}
        onClick={onCancel}
        type="button"
      >
        {isCancelling ? "Cancelling..." : "Cancel request"}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}