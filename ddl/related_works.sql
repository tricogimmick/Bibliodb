-- 関連作品データ
CREATE TABLE related_works ( 
  -- 関連先種別
  relatedType TEXT NOT NULL
  -- 副種別
  , subType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- 作品ID
  , workId INTEGER NOT NULL
  -- 解説
  , description TEXT
  -- PK
  , PRIMARY KEY (relatedType, subType, relatedId, workId)
);
CREATE INDEX related_works_workId ON related_works(workId, relatedType, subType, relatedId);
