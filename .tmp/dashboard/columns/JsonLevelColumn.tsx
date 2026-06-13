// path: src/components/dashboard/columns/JsonLevelColumn.tsx
import { ActivePath } from '../../../types/explorer';

const styles = {
  container: 'flex min-h-0 flex-1 flex-col',
  header: 'flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4',
  headerTitle: 'text-sm font-semibold text-slate-900',
  content: 'flex min-h-0 flex-1 items-center justify-center p-4 text-center',
  placeholder: 'text-sm text-slate-500',
} as const;

interface JsonLevelColumnProps {
  path: ActivePath;
}

export function JsonLevelColumn({ path }: JsonLevelColumnProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>{path.label}</h3>
      </div>
      <div className={styles.content}>
        <p className={styles.placeholder}>JSON coming soon</p>
      </div>
    </div>
  );
}
