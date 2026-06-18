// 컬럼 목록 항목이 방금 변경되어 하이라이트되어야 하는지 판별하는 공용 체크
export const isPathChanged = (changedPaths: string[], id: string): boolean =>
  changedPaths.some((p) => p.includes(id));
