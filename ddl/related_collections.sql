-- 関連コレクションデータ
CREATE TABLE related_collectinos ( 
  -- 関連先種別
  relatedType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- シリーズID
  , collectionId INTEGER NOT NULL
  -- 解説
  , description TEXT
  -- PK
  , PRIMARY KEY (relatedType, relatedId, collectionId)
);
CREATE INDEX related_collections_collectonId ON related_collectinos(collectionId, relatedType, relatedId);
