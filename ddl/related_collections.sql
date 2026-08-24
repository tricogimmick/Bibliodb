-- 関連コレクションデータ
CREATE TABLE related_collections ( 
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
CREATE INDEX related_collections_collectonId ON related_collections(collectionId, relatedType, relatedId);
