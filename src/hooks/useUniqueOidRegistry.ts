// path: src/hooks/useUniqueOidRegistry.ts
import { useCallback, useState } from 'react';
import { getUniqueOids, setUniqueOids as persistUniqueOids } from '../services/mockStorage';

// 이 앱이 직접 생성한 '고유 oid' 집합 — 다른 문서를 참조하지 않는 단순 식별자 값.
// 여기 없는 단일 {$oid} 필드는 모두 DBRef(참조)로 분류된다.
export function useUniqueOidRegistry() {
  const [uniqueOids, setUniqueOids] = useState<Set<string>>(() => new Set(getUniqueOids()));

  const registerUniqueOid = useCallback((oid: string) => {
    setUniqueOids((prev) => {
      if (prev.has(oid)) return prev;
      const next = new Set(prev);
      next.add(oid);
      persistUniqueOids([...next]);
      return next;
    });
  }, []);

  const unregisterUniqueOid = useCallback((oid: string) => {
    setUniqueOids((prev) => {
      if (!prev.has(oid)) return prev;
      const next = new Set(prev);
      next.delete(oid);
      persistUniqueOids([...next]);
      return next;
    });
  }, []);

  return { uniqueOids, registerUniqueOid, unregisterUniqueOid };
}
