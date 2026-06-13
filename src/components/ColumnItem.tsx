import { PathSegment } from "@/store/useExplorerStore"
import { JsonValue } from "@/data/sampleData"

// ── ColumnItem ──────────────────────────────

interface ColumnItemProps {
  seg: PathSegment
  value: JsonValue
  isSelected: boolean
  expandable: boolean
  onClick: () => void
}
 
export function ColumnItem({ seg, value, isSelected, expandable, onClick }: ColumnItemProps) {
  const preview =
    value === null
      ? 'null'
      : Array.isArray(value)
        ? `[${value.length}]`
        : typeof value === 'object'
          ? `{${Object.keys(value).length}}`
          : String(value)
 
  const labelPrefix =
    seg.kind === 'index' ? <span className="text-slate-300 mr-1 font-normal">#</span>
    : seg.kind === 'ref'  ? <span className="text-amber-400 mr-1 text-[10px]">ref</span>
    : null
 
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left
        text-[13px] transition-all duration-150 gap-3 group
        ${isSelected
          ? 'bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_theme(colors.indigo.200)]'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }
      `}
    >
      <span className="truncate font-medium leading-none flex items-center">
        {labelPrefix}{seg.key}
      </span>
      <span className={`
        shrink-0 text-[11px] tabular-nums font-mono leading-none
        ${isSelected ? 'text-indigo-400' : 'text-slate-300 group-hover:text-slate-400'}
        ${expandable ? "after:content-['_›']" : ''}
      `}>
        {preview}
      </span>
    </button>
  )
}

// ── 컬럼 헤더 ────────────────────────────────────────────────────────────────

export function ColumnHeader({ prefix, itemCount }: { prefix: PathSegment[]; itemCount: number }) {
  const title = prefix.length === 0 ? 'root' : prefix[prefix.length - 1].key
  return (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 shrink-0">
      <span className="text-[12px] font-semibold text-slate-700 truncate">{title}</span>
      <span className="ml-auto shrink-0 text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">
        {itemCount}
      </span>
    </div>
  )
}