-- 関連タグデータ
CREATE TABLE related_tags ( 
  -- 関連先種別
  relatedType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- TAGID
  , tagId INTEGER NOT NULL
  , PRIMARY KEY (relatedType, relatedId, tagId)
);
CREATE INDEX related_tags_tagId ON related_tags(tagId, relatedType, relatedId);
