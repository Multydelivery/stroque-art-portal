"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectRequest } from "@/types/entities";

export function RequestStatusSelect({ request }: { request: ProjectRequest }) {
  const router = useRouter();
  const [status, setStatus] = useState(request.status);

  async function update(nextStatus: ProjectRequest["status"]) {
    setStatus(nextStatus);
    await fetch(`/api/requests/${request._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    router.refresh();
  }

  return (
    <select value={status} onChange={(event) => update(event.target.value as ProjectRequest["status"])}>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="declined">Declined</option>
      <option value="completed">Completed</option>
    </select>
  );
}
