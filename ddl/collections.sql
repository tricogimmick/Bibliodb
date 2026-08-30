-- コクレクションマスタ
CREATE TABLE collections (
    -- ID(PK)
    id INTEGER PRIMARY KEY
    -- タイトル
    , title TEXT NOT NULL
    -- シリーズ
    , seriesId INTEGER
    -- 年度
    , term INTEGER
    -- イシュー
    , issue TEXT
    -- 種別
    , collectionType TEXT
    -- 説明
    , description TEXT
    -- メモ
    , note TEXT
)
CREATE UNIQUE INDEX collections_index ON works(title);

