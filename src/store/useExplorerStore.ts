import { create } from 'zustand'
import { JsonValue } from '../data/sampleData'

// ── PathSegment ───────────────────────────────────────────────────────────────

export type SegmentKind = 'key' | 'index' | 'ref'

export interface PathSegment {
  /** 실제 데이터 접근 키 (object key or array index string) */
  key: string
  /** 노드 종류 */
  kind: SegmentKind
  /** React key용 stable id — `${kind}:${key}` */
  id: number
  /** MongoDB ObjectId (kind === 'ref'일 때) */
  $oid?: string
}

// ── 팩토리 ────────────────────────────────────────────────────────────────────

export function makeSegment(
  key: string,
  kind: SegmentKind,
  oid?: string,
): PathSegment {
  return {
    key,
    kind,
    id: 0,
    ...(oid ? { $oid: oid } : {}),
  }
}

/** object key → 'key' segment */
export const keySegment   = (k: string)              => makeSegment(k, 'key')
/** array index → 'index' segment */
export const indexSegment = (i: number)              => makeSegment(String(i), 'index')
/** DBRef → 'ref' segment */
export const refSegment   = (k: string, oid: string) => makeSegment(k, 'ref', oid)

// ── Store ─────────────────────────────────────────────────────────────────────

interface ExplorerState {
  data: { [key: string]: JsonValue } | null
  path: PathSegment[]

  setData: (data: { [key: string]: JsonValue }) => void
  setPath: (path: PathSegment[]) => void
  pushSegment: (seg: PathSegment) => void
  popSegment: () => void
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  data: null,
  path: [],

  setData:      (data) => set({ data }),
  setPath:      (path) => set({ path }),
  pushSegment:  (seg)  => set((s) => ({ path: [...s.path, seg] })),
  popSegment:   ()     => set((s) => ({ path: s.path.slice(0, -1) })),
}))

// ── 유틸 ──────────────────────────────────────────────────────────────────────

/** path를 따라 data에서 현재 노드 반환 */
export function getNodeAtPath(
  data: { [key: string]: JsonValue } | null,
  path: PathSegment[],
): JsonValue | undefined {
  if (!data) return undefined
  let node: JsonValue = data
  for (const seg of path) {
    if (node === null || typeof node !== 'object') return undefined
    if (Array.isArray(node)) {
      node = node[Number(seg.key)]
    } else {
      node = (node as Record<string, JsonValue>)[seg.key]
    }
  }
  return node
}

/** 노드가 하위 탐색 가능한지 (object or array) */
export function isExpandable(value: JsonValue): boolean {
  return value !== null && typeof value === 'object'
}

/** 노드의 자식 엔트리 반환 — array는 index segment, object는 key segment */
export function getEntries(
  node: JsonValue,
): { seg: PathSegment; value: JsonValue }[] {
  if (node === null || typeof node !== 'object') return []
  if (Array.isArray(node)) {
    return node.map((v, i) => ({ seg: indexSegment(i), value: v }))
  }
  return Object.entries(node as Record<string, JsonValue>).map(([k, v]) => {
    // DBRef 감지: { $oid: string } 형태
    const oid =
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      typeof (v as Record<string, JsonValue>)['$oid'] === 'string'
        ? ((v as Record<string, JsonValue>)['$oid'] as string)
        : undefined
    return { seg: oid ? refSegment(k, oid) : keySegment(k), value: v }
  })
}

/** 상/하위 탐색, store 외부에서 Ref 연결 */
export function createGoSibling(
  getPath: () => PathSegment[],
  setPath: (path: PathSegment[]) => void,
  directionRef: React.MutableRefObject<number>,
  clickCounterRef: React.MutableRefObject<number>,
) {
  return function goSibling(index: number, isExpanded: boolean, seg: PathSegment) {
    const path    = getPath()
    const isFirst = index === 0
    const isLast  = index === 2

    directionRef.current = -1

    const next   = [...path]
    const offset = isFirst
      ? Math.min(path.length, 2)
      : Math.min(path.length - 1, 1)

    const hasPath    = path.length > 0
    const clickedIdx = isFirst ? Math.max(0, path.length - 2) : path.length - 1
    const clickedSeg = hasPath ? next[clickedIdx] : { key: '', id: 0 }

    if (seg.key !== clickedSeg.key) clickCounterRef.current += 1

    const newSegID =
      seg.key === clickedSeg.key ? clickedSeg.id : clickCounterRef.current

    if (isLast && isExpanded) {
      next.push({ ...seg, id: newSegID })
    } else if (isFirst) {
      directionRef.current = 1
      if (isExpanded) {
        if (offset) next.splice(-offset)
        next.push({ ...seg, id: newSegID })
      } else {
        if (offset) next.pop()
      }
    } else if (isExpanded) {
      directionRef.current = 1
      if (offset) next.pop()
      next.push({ ...seg, id: newSegID })
    }

    setPath(next)
  }
}