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
  later: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-100"
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
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-2xl bg-stone-50 dark:bg-[#121418]"
    >
      <div className="px-6 py-6">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 dark:text-white" id={headingId}>{title}</h2>
        <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">{subtitle}</p>
        <ul aria-label="Progress summary" className="mt-4 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <li key={stat.label} className="rounded-xl bg-white px-4 py-3 dark:bg-white/5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-white">{stat.value}</p>
            </li>
          ))}
        </ul>
      </div>
      <ol aria-label="Recommended sequence" className="grid gap-4 px-6 pb-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl bg-white p-4 dark:bg-white/5">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[step.status]}`}>
              {statusLabel[step.status]}
            </span>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
              <span className="mr-2 text-stone-500 dark:text-stone-300">{index + 1}.</span>{step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">{step.detail}</p>
            <Link className="mt-4 inline-flex text-sm font-semibold text-violet-700 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:text-violet-200 dark:focus-visible:ring-offset-[#121214]" href={step.href}>
              {step.cta}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}