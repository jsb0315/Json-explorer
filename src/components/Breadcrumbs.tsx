import { ChevronRight, Database, Folder, FileJson } from 'lucide-react';
import { cn } from '../utils/cn';

const styles = {
  container: 'flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm',
  crumb: 'flex items-center gap-2 font-medium text-slate-700',
  muted: 'text-slate-400',
};

interface BreadcrumbsProps {
  activeDatabase: string | null;
  activeCollection: string | null;
  activeDocumentId: string | null;
  pathSegments: string[];
  onSelectPathDepth?: (depth: number) => void;
}

export function Breadcrumbs({
  activeDatabase,
  activeCollection,
  activeDocumentId,
  pathSegments,
  onSelectPathDepth,
}: BreadcrumbsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.crumb}>
        <Database className="h-4 w-4 text-emerald-500" />
        <span>{activeDatabase ?? 'Select database'}</span>
      </div>
      <ChevronRight className={styles.muted} />
      <div className={styles.crumb}>
        <Folder className="h-4 w-4 text-emerald-500" />
        <span>{activeCollection ?? 'Select collection'}</span>
      </div>
      <ChevronRight className={styles.muted} />
      <button
        type="button"
        onClick={() => onSelectPathDepth?.(0)}
        className={cn(styles.crumb, !activeDocumentId && styles.muted)}
      >
        <FileJson className="h-4 w-4" />
        <span>{activeDocumentId ?? 'Select document'}</span>
      </button>
      {pathSegments.map((segment, index) => (
        <div key={`${segment}-${index}`} className="flex items-center gap-2">
          <ChevronRight className={styles.muted} />
          <button
            type="button"
            className={styles.crumb}
            onClick={() => onSelectPathDepth?.(index + 1)}
          >
            {segment}
          </button>
        </div>
      ))}
    </div>
  );
}
