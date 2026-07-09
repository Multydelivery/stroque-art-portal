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
      : "border border-stone-300 bg-white text-ink hover:bg-stone-50";

  return (
    <Link className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold ${classes}`} href={href}>
      {children}
    </Link>
  );
}
