import { currency } from "@/lib/format";
import type { ProjectRequest } from "@/types/entities";
import { EmptyState } from "@/components/EmptyState";
import { CancelRequestButton } from "@/components/CancelRequestButton";
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
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95" key={request._id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-stone-500 dark:text-stone-300">
                {mode === "artist" ? request.businessId?.businessName : request.artistId?.displayName}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-900 dark:text-stone-100">{request.spaceType}</h3>
              <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">{request.description}</p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm capitalize text-stone-800 dark:bg-[#262630] dark:text-stone-100">{request.status}</span>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-medium text-stone-900 dark:text-stone-100">Budget</dt>
              <dd className="text-stone-600 dark:text-stone-300">{currency(request.budget)}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900 dark:text-stone-100">Timeline</dt>
              <dd className="text-stone-600 dark:text-stone-300">{request.timeline}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900 dark:text-stone-100">Style</dt>
              <dd className="text-stone-600 dark:text-stone-300">{request.stylePreference}</dd>
            </div>
          </dl>
          {mode === "artist" && (
            <div className="mt-5 max-w-xs">
              <RequestStatusSelect request={request} />
            </div>
          )}
          {mode === "business" && (
            <div className="mt-5 max-w-xs">
              <CancelRequestButton requestId={request._id} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
