import Link from "next/link";

type GuidedStep = {
  title: string;
  detail: string;
  href: string;
  cta: string;
  status: "done" | "next" | "later";
};

const statusLabel: Record<GuidedStep["status"], string> = {
  done: "Done",
  next: "Do this next",
  later: "Coming up"
};

const statusClasses: Record<GuidedStep["status"], string> = {
  done: "bg-emerald-100 text-emerald-800",
  next: "bg-amber-100 text-amber-900",
  later: "bg-stone-200 text-stone-700"
};

export function GuidedStartPanel({
  title,
  subtitle,
  stats,
  steps
}: {
  title: string;
  subtitle: string;
  stats: Array<{ label: string; value: string | number }>;
  steps: GuidedStep[];
}) {
  const headingId = "guided-start-heading";

  return (
    <section aria-labelledby={headingId} className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white via-amber-50 to-stone-100 shadow-soft">
      <div className="border-b border-stone-200/70 px-6 py-6">
        <h2 className="text-2xl font-semibold tracking-tight" id={headingId}>{title}</h2>
        <p className="mt-1 text-sm text-stone-700">{subtitle}</p>
        <ul aria-label="Progress summary" className="mt-4 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <li key={stat.label} className="rounded-xl border border-stone-200 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-stone-500">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-ink">{stat.value}</p>
            </li>
          ))}
        </ul>
      </div>
      <ol aria-label="Recommended sequence" className="grid gap-4 px-6 py-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-stone-200 bg-white p-4">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[step.status]}`}>
              {statusLabel[step.status]}
            </span>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">
              <span className="mr-2 text-stone-500">{index + 1}.</span>{step.title}
            </h3>
            <p className="mt-2 text-sm text-stone-600">{step.detail}</p>
            <Link className="mt-4 inline-flex text-sm font-semibold text-ink underline-offset-4 hover:underline" href={step.href}>
              {step.cta}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}