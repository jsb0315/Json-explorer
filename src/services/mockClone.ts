// path: src/services/mockClone.ts
import {
  isBsonObjectId,
  isPlainObject,
  type Document,
  type JsonObject,
  type JsonValue,
  type MockCollectionRecord,
  type MockDatabaseRecord,
  type MockSnapshot,
} from '../types/explorer';

export const isJsonObject = (value: unknown): value is JsonObject => isPlainObject(value) && !isBsonObjectId(value);

// 주의: mockStorage.ts에도 거의 같은 모양의 cloneValue가 있다.
// 그쪽은 BSON {$oid} 리프 객체까지 항상 새로 복제하지만, 여기는 isJsonObject가
// {$oid} 객체를 걸러내 원본 참조를 그대로 반환한다 — 결과 JSON은 동일해도
// 참조 동일성이 다르다. 의도적으로 병합하지 않았으니 이 차이를 모르고
// 합치지 말 것 (둘 다 "항상 같은 이유로 같이 바뀌는" 로직이 아님).
export const cloneValue = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isJsonObject(value)) {
    const next: JsonObject = {};
    for (const [key, child] of Object.entries(value)) {
      next[key] = cloneValue(child as JsonValue);
    }
    return next;
  }

  return value;
};

export const cloneDocument = (document: Document): Document => cloneValue(document) as Document;

export const cloneCollectionMap = (snapshot: MockSnapshot): MockSnapshot => {
  const databases: Record<string, MockDatabaseRecord> = {};
  for (const [databaseName, database] of Object.entries(snapshot.databases)) {
    const collections: Record<string, MockCollectionRecord> = {};
    for (const [collectionName, collection] of Object.entries(database.collections)) {
      collections[collectionName] = {
        ...collection,
        documents: collection.documents.map((document) => cloneDocument(document)),
      };
    }

    databases[databaseName] = {
      ...database,
      collections,
    };
  }

  return {
    ...snapshot,
    databases,
  };
};
