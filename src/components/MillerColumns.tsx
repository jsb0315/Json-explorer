import React, { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useExplorerStore,
  getNodeAtPath,
  getEntries,
  isExpandable,
  PathSegment,
  createGoSibling,
} from '../store/useExplorerStore'
import { JsonValue } from '../data/sampleData'
import { ColumnHeader, ColumnItem } from './ColumnItem'
// import { ColumnItem } from './ColumnItem' // 추후 분리 시 활성화

// ── 애니메이션 ─────────────────────────────────────────────────────────────────

const spring = { type: 'spring' as const, stiffness: 250, damping: 28 }

// ── 상수 ──────────────────────────────────────────────────────────────────────

const MAX_COLUMNS = 3
const FLEX_RATIOS = [3, 3, 4]


// ── MillerColumns ──────────────────────────────────────────────────────────

export default function MillerColumns() {
  const { data, path, setPath } = useExplorerStore()
  console.log({data})
  const directionRef = useRef(1)
  const clickCounterRef = useRef(0)

  const goSibling = useMemo(
    () => createGoSibling(
      () => useExplorerStore.getState().path,
      setPath,
      directionRef,
      clickCounterRef,
    ),
    [setPath],
  )

  const columnVariants = useMemo(() => ({
    enter: () => ({ x: directionRef.current > 0 ? '-100%' : '100%', scale: 1, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: () => ({ x: directionRef.current > 0 ? '-100%' : '100%', scale: 0.9, opacity: 0 }),
  }), [])

  const placeholderVariants = useMemo(() => ({
    enter: { opacity: 0, scale: 0.85 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  }), [])

  // 항상 3슬롯. path 길이에 따라 앞 슬롯부터 채움
  const colPrefixes: (PathSegment[] | null)[] = (() => {
    if (path.length === 0) return [[], null, null]
    if (path.length === 1) return [[], path.slice(0, 1), null]
    return [
      path.slice(0, Math.max(0, path.length - 2)),
      path.slice(0, path.length - 1),
      path.slice(0, path.length),
    ].slice(-MAX_COLUMNS) as (PathSegment[] | null)[]
  })()

  const paddedPrefixes: (PathSegment[] | null)[] = [
    ...Array(Math.max(0, MAX_COLUMNS - colPrefixes.length)).fill(null),
    ...colPrefixes,
  ]

  // 컬럼 prefix 길이 위치에서 선택된 segment
  function selectedSegment(prefix: PathSegment[]): PathSegment | null {
    return path[prefix.length] ?? null
  }
  function navigate(prefix: PathSegment[], seg: PathSegment) {
    directionRef.current = 1
    setPath([...prefix, seg])
  }


  // function goSibling(index: number, isExpanded: boolean, seg: PathSegment) {
  //   const isFirst = index === 0
  //   const isLast  = index === 2

  //   // directionRef.current = -1
  //   directionRef.current = -1

  //   let next = [...path]
  //   const offset = isFirst
  //   ? Math.min(path.length, 2)  // first -> path 길이(최대 2)
  //   : Math.min(path.length - 1, 1)  // 2, 3번째 -> path boolean (0 or 1)

  //   const hasPath = path.length > 0

  //   const clickedIndex = isFirst
  //     ? Math.max(0, path.length - 2)
  //     : path.length - 1

  //   const clickedSeg = hasPath
  //     ? next[clickedIndex]
  //     : { key: '', id: 0 }

  //   if (seg.key !== clickedSeg.key)
  //     clickCounterRef.current += 1

  //   const newSegID =
  //     seg.key === clickedSeg.key
  //       ? clickedSeg.id
  //       : clickCounterRef.current

  //   // 케이스 1: 마지막 컬럼 + 확장 → 새 노드 push
  //   if (isLast && isExpanded) {
  //     next.push({...seg, id: newSegID})
  //   }
  //   // 케이스 2: 첫 번째 컬럼
  //   else if (isFirst) {
  //     directionRef.current = 1
  //     if (isExpanded) {
  //       if (offset) next.splice(-offset)
  //       next.push({...seg, id: newSegID})
  //     } else {
  //       if (offset) next.pop()
  //     }
  //   }
  //   // 케이스 3: 중간 컬럼 + 확장
  //   else if (isExpanded) {
  //     directionRef.current = 1
  //     if (offset) {
  //       next.pop()
  //     }
  //     next.push({...seg, id: newSegID})
  //   }

  //   setPath(next)
  // }

  return (
    <div className="relative flex h-full w-full gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {paddedPrefixes.map((prefix, colIndex) => {
          const isPlaceholder = prefix === null
          const flex = FLEX_RATIOS[colIndex]
          const key = isPlaceholder
            ? `placeholder-${colIndex}`
            : `col-${prefix.length ? prefix[prefix.length - 1].id : '0'}`

          const node = isPlaceholder ? null : getNodeAtPath(data, prefix)
          const entries = node != null ? getEntries(node as JsonValue) : []
          // console.log('rendering column', { key, prefix, colIndex, entries })

          return (
            <motion.div
              key={key}
              variants={isPlaceholder ? placeholderVariants : columnVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: spring, opacity: { duration: 0.2, ease: 'easeInOut' } }}
              layout
              style={{ flex, zIndex: 100 - colIndex }}
              className={`min-w-0 h-full flex flex-col rounded-2xl bg-white overflow-hidden ${isPlaceholder ? 'border border-dashed border-slate-200 opacity-40 shadow-none'
                : 'border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)]'}`}
            >
              {isPlaceholder ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base">
                    📂
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed m-0">
                    {colIndex === 1 ? '항목을 선택하세요' : '하위 항목이 표시됩니다'}
                  </p>
                </div>
              ) : (
                <>
                  {/* 컬럼 헤더 */}
                  <ColumnHeader prefix={prefix} itemCount={entries.length} />
                  {/* 아이템 목록 — 독립 스크롤 */}
                  <div className="flex-1 overflow-y-auto min-h-0 p-2 flex flex-col gap-0.5">
                    {entries.map(({ seg, value }) => {
                      const expandable = isExpandable(value)
                      const selected = selectedSegment(prefix)?.key === seg.key

                      return (
                        <ColumnItem
                          key={seg.key}
                          seg={seg}
                          value={value}
                          isSelected={selected}
                          expandable={expandable}
                          onClick={() => goSibling(colIndex, expandable, seg)}
                        />
                      )
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}