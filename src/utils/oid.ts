export type OidValue = { $oid: string };

export const isOidObject = (value: unknown): value is OidValue =>
  !!value && typeof value === 'object' && !Array.isArray(value) && typeof (value as OidValue).$oid === 'string';

export const extractOid = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (isOidObject(value)) return value.$oid;
  if (value && typeof value === 'object' && 'toString' in value) return String(value);
  return null;
};

export const wrapOid = (oid: string): OidValue => ({ $oid: oid });
