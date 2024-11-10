-- 関連リンクデータ
CREATE TABLE related_links ( 
  -- ID
  id INTEGER PRIMARY KEY
  -- 関連先種別
  , relatedType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- リンク種別
  , linkType TEXT NOT NULL
  -- URL
  , url TEXT NOT NULL
  -- ALT
  , alt TEXT
  -- 解説
  , description TEXT
);
CREATE INDEX related_links_relatedId ON related_links(relatedType, relatedId, id);
