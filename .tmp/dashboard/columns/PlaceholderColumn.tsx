// path: src/components/dashboard/columns/PlaceholderColumn.tsx

const styles = {
  container: 'flex min-h-0 flex-1 flex-col items-center justify-center p-4 text-center',
  card: 'max-w-xs rounded-[12px] border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6',
  title: 'text-sm font-medium text-slate-500',
  description: 'mt-2 text-xs text-slate-400',
} as const;

export function PlaceholderColumn() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.title}>Select an item</p>
        <p className={styles.description}>to start exploring</p>
      </div>
    </div>
  );
}
