// path: src/utils/jsonTree.ts
import { isBsonObjectId, type Document, type JsonValue } from '../types/explorer';

export type JsonFieldType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'oid';

export const getFieldType = (v: JsonValue): JsonFieldType => {
  if (v === null) return 'null';
  if (isBsonObjectId(v)) return 'oid';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'object') return 'object';
  return typeof v as 'string' | 'number' | 'boolean';
};

export const resolveAtPath = (doc: Document, path: string[]): JsonValue => {
  let node: JsonValue = doc;
  for (const seg of path) {
    if (node === null || typeof node !== 'object') return null;
    if (Array.isArray(node)) {
      node = (node as JsonValue[])[Number(seg)] ?? null;
    } else {
      node = (node as Record<string, JsonValue>)[seg] ?? null;
    }
  }
  return node;
};

export const getEntries = (node: JsonValue): { key: string; value: JsonValue }[] => {
  if (node === null || typeof node !== 'object') return [];
  if (Array.isArray(node)) {
    return (node as JsonValue[]).map((v, i) => ({ key: String(i), value: v }));
  }
  return Object.entries(node as Record<string, JsonValue>).map(([k, v]) => ({ key: k, value: v }));
};
