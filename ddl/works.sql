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
    -- 付記
    , note TEXT
    -- 発表年
    , publishYear INTEGER
    -- 連番
    , seqNo INTEGER
    -- 読了日
    , finishedReading TEXT
)