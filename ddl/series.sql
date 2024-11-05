-- シリーズマスタ
CREATE TABLE series (
    -- ID (PK)
    id INTEGER PRIMARY KEY
    -- インデックス名
    , nameIndex TEXT NOT NULL
    -- 題名
    , title TEXT NOT NULL
    -- 原題
    , originalTitle TEXT
    -- 種別
    , seriesType TEXT NOT NULL
    -- 出版社
    , publisherId INTEGER
    -- 説明
    , description TEXT
);
CREATE UNIQUE INDEX series_nameIndex ON series(nameIndex);
