import { currency } from "@/lib/format";
import type { ProjectRequest } from "@/types/entities";
import { EmptyState } from "@/components/EmptyState";
import { RequestStatusSelect } from "@/components/RequestStatusSelect";

export function RequestList({
  requests,
  mode
}: {
  requests: ProjectRequest[];
  mode: "artist" | "business";
}) {
  if (!requests.length) {
    return <EmptyState title="No requests yet" body="Project requests will appear here as soon as a business contacts an artist." />;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" key={request._id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-stone-500">
                {mode === "artist" ? request.businessId?.businessName : request.artistId?.displayName}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{request.spaceType}</h3>
              <p className="mt-2 text-sm text-stone-700">{request.description}</p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm capitalize">{request.status}</span>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-medium">Budget</dt>
              <dd className="text-stone-600">{currency(request.budget)}</dd>
            </div>
            <div>
              <dt className="font-medium">Timeline</dt>
              <dd className="text-stone-600">{request.timeline}</dd>
            </div>
            <div>
              <dt className="font-medium">Style</dt>
              <dd className="text-stone-600">{request.stylePreference}</dd>
            </div>
          </dl>
          {mode === "artist" && (
            <div className="mt-5 max-w-xs">
              <RequestStatusSelect request={request} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
