import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "dark"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  const classes =
    variant === "dark"
      ? "bg-ink text-white hover:bg-black"
      : "border border-stone-300 bg-white text-ink hover:bg-stone-50 dark:border-white/30 dark:bg-[#1b1b21] dark:text-stone-100 dark:hover:bg-[#25252d]";

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214] ${classes}`}
      href={href}
    >
      {children}
    </Link>
  );
}
