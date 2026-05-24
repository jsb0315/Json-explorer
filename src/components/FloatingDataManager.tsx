import { useMemo, useState } from 'react';
import {
  Braces,
  Database,
  Edit3,
  Plus,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import type { DbCatalog, Document } from '../types/explorer';
import { cn } from '../utils/cn';

const styles = {
  wrapper: 'fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3',
  toggle: 'rounded-full border border-emerald-500/50 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(16,185,129,0.2)] transition hover:scale-[1.02]',
  panel: 'w-[360px] max-w-[90vw] rounded-[16px] border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur',
  section: 'rounded-[12px] border border-slate-200 bg-slate-50 p-3',
  sectionTitle: 'text-xs font-semibold uppercase tracking-[0.2em] text-slate-500',
  input: 'flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-400/60 focus:outline-none',
  chip: 'rounded-full border px-3 py-1 text-xs transition',
  chipActive: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
  chipInactive: 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400/40 hover:text-emerald-700',
  action: 'rounded-[10px] border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:scale-[1.02]',
  ghost: 'text-xs text-slate-500 hover:text-rose-500',
};

interface FloatingDataManagerProps {
  isOpen: boolean;
  onToggle: () => void;
  catalogs: DbCatalog[];
  activeDatabase: string | null;
  activeCollection: string | null;
  activeDocument: Document | null;
  documents: Document[];
  jsonInputs: string[];
  jsonErrors: string[];
  onSelectDatabase: (database: string) => void;
  onSelectCollection: (collection: string) => void;
  onAddDatabase: (name: string) => void;
  onRemoveDatabase: (name: string) => void;
  onAddCollection: (database: string, name: string) => void;
  onRemoveCollection: (database: string, name: string) => void;
  onRemoveDocument: (id: string) => void;
  onAddJsonInput: () => void;
  onUpdateJsonInput: (index: number, value: string) => void;
  onRemoveJsonInput: (index: number) => void;
  onSubmitJsonInputs: () => void;
}

const getDocId = (doc: Document) => {
  const raw = doc._id;
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
  if (raw && typeof raw === 'object' && 'toString' in raw) return String(raw);
  return '';
};

export function FloatingDataManager({
  isOpen,
  onToggle,
  catalogs,
  activeDatabase,
  activeCollection,
  activeDocument,
  documents,
  jsonInputs,
  jsonErrors,
  onSelectDatabase,
  onSelectCollection,
  onAddDatabase,
  onRemoveDatabase,
  onAddCollection,
  onRemoveCollection,
  onRemoveDocument,
  onAddJsonInput,
  onUpdateJsonInput,
  onRemoveJsonInput,
  onSubmitJsonInputs,
}: FloatingDataManagerProps) {
  const [localDatabase, setLocalDatabase] = useState('');
  const [localCollection, setLocalCollection] = useState('');

  const activeDbEntry = useMemo(
    () => catalogs.find((entry) => entry.database === activeDatabase),
    [catalogs, activeDatabase]
  );

  const handleLoadActiveDocument = () => {
    if (!activeDocument) return;
    if (jsonInputs.length === 0) onAddJsonInput();
    onUpdateJsonInput(0, JSON.stringify(activeDocument, null, 2));
  };

  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={onToggle} className={styles.toggle}>
        {isOpen ? 'Hide manager' : 'Open manager'}
      </button>
      {isOpen ? (
        <div className={styles.panel}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Floating Data Manager</div>
              <div className="text-xs text-slate-500">Inject JSON and edit mock documents.</div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              Live
            </span>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Database</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {catalogs.map((catalog) => (
                  <div key={catalog.database} className="flex">
                    <button
                      type="button"
                      onClick={() => onSelectDatabase(catalog.database)}
                      className={cn(
                        styles.chip,
                        'rounded-l-full',
                        activeDatabase === catalog.database ? styles.chipActive : styles.chipInactive
                      )}
                    >
                      <Database className="mr-1 inline h-3 w-3" />
                      {catalog.database}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveDatabase(catalog.database)}
                      className="rounded-r-full border border-slate-200 bg-white px-2 text-xs text-slate-600 transition hover:border-emerald-400/40 hover:text-emerald-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={localDatabase}
                  onChange={(event) => setLocalDatabase(event.target.value)}
                  placeholder="new-database"
                  className={styles.input}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onAddDatabase(localDatabase);
                      setLocalDatabase('');
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => {
                    onAddDatabase(localDatabase);
                    setLocalDatabase('');
                  }}
                >
                  <Plus className="mr-1 inline h-3 w-3" />
                  Add
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Collections</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeDbEntry?.collections.map((entry) => (
                  <button
                    key={entry.collection.name}
                    type="button"
                    onClick={() => onSelectCollection(entry.collection.name)}
                    className={cn(
                      styles.chip,
                      activeCollection === entry.collection.name ? styles.chipActive : styles.chipInactive
                    )}
                  >
                    {entry.collection.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeDbEntry?.collections.map((entry) => (
                  <button
                    key={`${entry.collection.name}-remove`}
                    type="button"
                    onClick={() => onRemoveCollection(activeDatabase ?? '', entry.collection.name)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-emerald-400/40 hover:text-emerald-700"
                  >
                    Remove {entry.collection.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={localCollection}
                  onChange={(event) => setLocalCollection(event.target.value)}
                  placeholder="new-collection"
                  className={styles.input}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && activeDatabase) {
                      onAddCollection(activeDatabase, localCollection);
                      setLocalCollection('');
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => {
                    if (!activeDatabase) return;
                    onAddCollection(activeDatabase, localCollection);
                    setLocalCollection('');
                  }}
                >
                  <Plus className="mr-1 inline h-3 w-3" />
                  Add
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Documents</div>
              <div className="mt-2 space-y-2">
                {activeCollection ? (
                  documents.length === 0 ? (
                    <div className="rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                      No documents loaded for this collection.
                    </div>
                  ) : (
                    documents.map((doc, index) => {
                      const id = getDocId(doc);
                      return (
                        <div
                          key={id || `doc-${index}`}
                          className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          <span className="text-slate-600">{id || 'document'}</span>
                          {id ? (
                            <button
                              type="button"
                              onClick={() => onRemoveDocument(id)}
                              className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          ) : null}
                        </div>
                      );
                    })
                  )
                ) : (
                  <div className="rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                    Select a collection to manage its documents.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <div className="mb-2 flex items-center justify-between">
                <div className={styles.sectionTitle}>JSON documents</div>
                <button
                  type="button"
                  onClick={handleLoadActiveDocument}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 transition hover:border-emerald-300/60 hover:text-emerald-700"
                >
                  <Edit3 className="h-3 w-3" />
                  Load selected
                </button>
              </div>

              <div
                className={cn(
                  'space-y-3 overflow-hidden transition-all duration-300',
                  activeCollection ? 'max-h-[620px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                {jsonInputs.map((value, index) => (
                  <div key={`json-${index}`} className="rounded-[12px] border border-slate-200 bg-white p-2">
                    <textarea
                      value={value}
                      onChange={(event) => onUpdateJsonInput(index, event.target.value)}
                      className="h-24 w-full resize-none rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-400/50 focus:outline-none"
                    />
                    {jsonErrors[index] ? (
                      <div className="mt-2 text-xs text-rose-600">{jsonErrors[index]}</div>
                    ) : null}
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onRemoveJsonInput(index)}
                        className={styles.ghost}
                      >
                        Remove block
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {!activeCollection ? (
                <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                  <Braces className="h-3 w-3" />
                  Select a collection to open the JSON editor.
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onAddJsonInput}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-emerald-400/40 hover:text-emerald-700"
                >
                  <Plus className="mr-1 inline h-3 w-3" />
                  Add block
                </button>
                <button
                  type="button"
                  onClick={onSubmitJsonInputs}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1 text-xs font-semibold text-emerald-700 transition hover:scale-[1.02]"
                >
                  <Send className="mr-1 inline h-3 w-3" />
                  Submit JSON
                </button>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Tip: If the JSON contains an existing _id, it updates that document.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
