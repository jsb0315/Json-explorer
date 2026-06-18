// path: src/services/mockEventBus.ts
import type { ChangeResponse, Document, MockDatabaseRecord, MockSnapshot } from '../types/explorer';
import { cloneDocument } from './mockClone';
import { collectionKey } from './mockQuery';

type ChangeListener = (change: ChangeResponse) => void;

// 모듈 싱글턴이어야 한다 — subscribeToChanges로 등록한 구독자와 emitChange가
// 같은 Map 인스턴스를 봐야 알림이 전달된다. 이 파일을 두 번 다른 경로로
// import하게 만들면(예: 별칭 경로 추가) 구독이 조용히 끊어지니 주의.
const listeners = new Map<string, Set<ChangeListener>>();

const uniqueStrings = (values: string[]): string[] => [...new Set(values)];

export const emitChange = (databaseName: string, collectionName: string, change: ChangeResponse): void => {
  for (const key of uniqueStrings([collectionName, collectionKey(databaseName, collectionName)])) {
    const registered = listeners.get(key);
    if (!registered) {
      continue;
    }

    for (const listener of [...registered]) {
      try {
        listener(change);
      } catch {
        // Subscriber errors should not break the mock bus.
      }
    }
  }
};

export const emitCollectionReplace = (databaseName: string, collectionName: string, documents: Document[]): void => {
  emitChange(databaseName, collectionName, {
    type: 'replace',
    database: databaseName,
    collection: collectionName,
    data: documents.map((document) => cloneDocument(document)),
    tracePath: [databaseName, collectionName],
  });
};

export const emitDatabaseSnapshot = (snapshot: MockSnapshot): void => {
  for (const [databaseName, database] of Object.entries(snapshot.databases)) {
    for (const [collectionName, collection] of Object.entries(database.collections)) {
      emitCollectionReplace(databaseName, collectionName, collection.documents);
    }
  }
};

export const emitDatabaseCollections = (databaseName: string, database: MockDatabaseRecord): void => {
  for (const [collectionName, collection] of Object.entries(database.collections)) {
    emitCollectionReplace(databaseName, collectionName, collection.documents);
  }
};

export const subscribeToChanges = (collectionId: string, callback: (change: ChangeResponse) => void): (() => void) => {
  const currentListeners = listeners.get(collectionId) ?? new Set<ChangeListener>();
  currentListeners.add(callback);
  listeners.set(collectionId, currentListeners);

  return () => {
    const registered = listeners.get(collectionId);
    if (!registered) {
      return;
    }

    registered.delete(callback);
    if (registered.size === 0) {
      listeners.delete(collectionId);
    }
  };
};
