-- 印刷物マスタ
CREATE TABLE prints (
    -- ID(PK)
    id INTEGER PRIMARY KEY
    -- タイトル
    , title TEXT NOT NULL
    -- 原題
    , originalTitle TEXT
    -- 印刷種別(book, magazine...)
    , printType TEXT NOT NULL
    -- 作品種別(小説,エッセイ...)
    , contentType TEXT NOT NULL
    -- 出版社(FK - publishers)
    , publisherId INTEGER
    -- 発行日
    , publicationDate TEXT
    -- シリーズ
    , seriesId INTEGER
    -- 説明
    , description TEXT
)