import type { JsonPathSegment } from '../types/explorer-ui';

export const ROOT_HIGHLIGHT = '__root__';

export const pathToKey = (segments: JsonPathSegment[]) =>
  segments
    .map((segment) => {
      if (segment.type === 'key') return segment.key;
      if (segment.type === 'index') return `[${segment.index}]`;
      return `@${segment.id}`;
    })
    .join('.');

export const pathSegmentLabel = (segment: JsonPathSegment) => {
  if (segment.type === 'key') return segment.key;
  if (segment.type === 'index') return `[${segment.index}]`;
  return segment.id;
};
