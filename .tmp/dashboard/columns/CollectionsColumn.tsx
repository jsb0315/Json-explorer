// path: src/components/dashboard/columns/CollectionsColumn.tsx
import { ActivePath } from '../../../types/explorer';

const styles = {
  container: 'flex min-h-0 flex-1 flex-col',
  header: 'flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4',
  headerTitle: 'text-sm font-semibold text-slate-900',
  content: 'flex min-h-0 flex-1 items-center justify-center p-4 text-center',
  placeholder: 'text-sm text-slate-500',
} as const;

interface CollectionsColumnProps {
  path: ActivePath;
}

export function CollectionsColumn({ path }: CollectionsColumnProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>{path.label}</h3>
      </div>
      <div className={styles.content}>
        <p className={styles.placeholder}>Collections coming soon</p>
      </div>
    </div>
  );
}
