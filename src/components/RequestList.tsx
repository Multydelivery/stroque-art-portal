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
        <article className="rounded-2xl bg-stone-50 p-5 dark:bg-white/5" key={request._id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300">
                {mode === "artist" ? request.businessId?.businessName : request.artistId?.displayName}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-900 dark:text-white">{request.spaceType}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">{request.description}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm capitalize text-stone-700 dark:bg-[#1d242a] dark:text-stone-100">{request.status}</span>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-medium text-stone-900 dark:text-white">Budget</dt>
              <dd className="mt-1 text-stone-700 dark:text-stone-200">{currency(request.budget)}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900 dark:text-white">Timeline</dt>
              <dd className="mt-1 text-stone-700 dark:text-stone-200">{request.timeline}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-900 dark:text-white">Style</dt>
              <dd className="mt-1 text-stone-700 dark:text-stone-200">{request.stylePreference}</dd>
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
