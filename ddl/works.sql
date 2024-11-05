-- 作品マスタ
CREATE TABLE works ( 
    -- ID(PK)
    id INTEGER PRIMARY KEY
    -- 作品名
    , title TEXT NOT NULL
    -- 原題
    , originalTitle TEXT
    -- 種別
    , contentType TEXT NOT NULL
    -- 説明
    , description TEXT
    -- URL
    , url TEXT
    -- 付記
    , note TEXT
)