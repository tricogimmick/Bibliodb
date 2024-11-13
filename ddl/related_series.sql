-- 関連シリーズデータ
CREATE TABLE related_series ( 
  -- 関連先種別
  relatedType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- シリーズID
  , seriesId INTEGER NOT NULL
  -- 解説
  , description TEXT
  -- PK
  , PRIMARY KEY (relatedType, relatedId, seriesId)
);
CREATE INDEX related_series_seriesId ON related_series(seriesId, relatedType, relatedId);
