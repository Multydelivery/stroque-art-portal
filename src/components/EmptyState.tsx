export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/25 dark:bg-[#17171d]/95">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-200">{body}</p>
    </div>
  );
}
