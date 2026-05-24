import type { ReactNode } from 'react';

export type Document = Record<string, unknown>;

export type DbStatus =
  | { state: "primary";   oplogSizeMb: number; lagMs: 0 }
  | { state: "secondary"; oplogSizeMb: number; lagMs: number }
  | { state: "arbiter" }
  | { state: "startup" }
  | { state: "unknown";   reason: string }

export type CollectionStat = {
  name:         string
  documentCount: number
  sizeMb:       number
  indexCount:   number
  hasChangeStreamSupport: boolean   // RS 여부에 따라 결정
}

export type IndexInfo = {
  name:    string
  keys:    Record<string, 1 | -1 | "text" | "2dsphere">
  unique:  boolean
  sparse:  boolean
  ttlSecs?: number    // TTL 인덱스일 때만 존재
}

export type CatalogEntry = {
  collection: CollectionStat
  indexes:    IndexInfo[]
  validator?: Document    // schema validation rule
}

export type DbCatalog = {
  database:    string
  status:      DbStatus
  collections: CatalogEntry[]
  fetchedAt:   number
}

export type QueryRange =
  | { type: "all" }
  | { type: "paginated"; page: number; pageSize: number }
  | { type: "time";      from: number; to: number }        // epoch ms
  | { type: "cursor";    afterId: string; limit: number }  // 대용량에 적합

export type QueryMeta = {
  collection: string
  range:      QueryRange
  executedAt: number
  durationMs: number
}

export type QueryResult<T = Document> =
  | { status: "ok";           data: T[]; meta: QueryMeta; total?: number }
  | { status: "empty";                   meta: QueryMeta }
  | { status: "partial";      data: T[]; meta: QueryMeta; reason: "timeout" | "size-limit" }
  | { status: "no-permission";           collection: string }
  | { status: "invalid-range";           error: string }

export type TimeWindow =
  | { type: "last";    amount: number; unit: "minutes" | "hours" | "days" }
  | { type: "fixed";   from: number;   to: number }   // epoch ms
  | { type: "open";    from: number }                 // from 이후 전부

export type FieldFilter =
  | { op: "eq";      field: string; value: unknown }
  | { op: "in";      field: string; values: unknown[] }
  | { op: "range";   field: string; gte?: unknown; lte?: unknown }
  | { op: "exists";  field: string; exists: boolean }
  | { op: "and";     filters: FieldFilter[] }
  | { op: "or";      filters: FieldFilter[] }

export type ViewScope = {
  collection:  string
  timeWindow:  TimeWindow
  filters:     FieldFilter[]    // 사용자가 걸어둔 필터 조건
  fields?:     string[]         // 특정 필드만 볼 때 (projection)
  sortBy?:     { field: string; dir: "asc" | "desc" }
}
  
export type WatchRequest = {
  sessionId: string;
  collection: string;
  pipeline?: Document[];
  scope: ViewScope;
  resumeAfter?: string; // Base64로 인코딩된 Resume Token
  throttleMs?: number;  // 지정 시, 해당 시간만큼 모아서 'replace' 또는 배열로 전송
}

// UI 친화적인 패치 이벤트
export type FriendlyPatchEvent = {
  field: string;
  op: "updated" | "added" | "removed";
  oldValue?: unknown;
  newValue?: unknown;
}

export type ChangeResponse =
	| { type: "patch"; patch: FriendlyPatchEvent[] } // RFC 6902 대신 직관적인 패치 (후술)
  | { type: "replace"; data: Document[] }
  | { type: "invalidate"; reason: "collection-dropped" | "collection-renamed" }
  | { type: "system"; action: "permission-revoked" | "force-disconnect" }