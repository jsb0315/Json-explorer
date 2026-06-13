import React, { useEffect } from 'react'
import { useExplorerStore } from '../store/useExplorerStore'
import MillerColumns from './MillerColumns'
import { sampleData } from '../data/sampleData'

export const JsonExplorer: React.FC = () => {
  const { setData, path, setPath } = useExplorerStore()

  useEffect(() => {
    setData(sampleData)
  }, [setData])

  const breadcrumb = ['root', ...path.map(s => s.key)]

  // breadcrumb 클릭 → root(i=0)면 [], 아니면 path.slice(0, i)
  const handleBreadcrumbClick = (i: number) => {
    if (i === breadcrumb.length - 1) return  // 현재 위치 클릭 무시
    setPath(path.slice(0, i))                // root면 i=0 → []
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.08)] border border-slate-200/60">
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="shrink-0 px-4 py-3 border-b border-slate-100 bg-white/90 backdrop-blur-sm flex items-center gap-3">
        {/* Logo / title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-[11px] font-bold leading-none">{'{}'}</span>
          </div>
          <span className="font-semibold text-slate-800 text-sm tracking-tight">JSON Explorer</span>
        </div>

        {/* 구분선 */}
        <div className="w-px h-4 bg-slate-200 shrink-0" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
          {breadcrumb.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-slate-300 text-[11px] shrink-0 select-none">/</span>
              )}
              <span
                className={[
                  'text-[12px] truncate max-w-[100px] shrink-0 transition-colors',
                  i === breadcrumb.length - 1
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 cursor-pointer',
                ].join(' ')}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Depth badge */}
        <span className="shrink-0 text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg leading-none">
          depth {path.length}
        </span>
      </header>

      {/* ── Miller columns ─ flex-1으로 나머지 공간 전부 차지 ──────────────── */}
      <div className="relative flex flex-1 h-full w-full min-h-0 p-2 overflow-hidden">
        <MillerColumns />
      </div>
    </div>
  )
}