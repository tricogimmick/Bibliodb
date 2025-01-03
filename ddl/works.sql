-- 作品マスタ
CREATE TABLE works ( 
    -- ID(PK)
    id INTEGER PRIMARY KEY
    -- INDEX
    , index TEXT NOT NULL
    -- 作品名
    , title TEXT NOT NULL
    -- 別名
    , variantTitles TEXT
    -- 原題
    , originalTitle TEXT
    -- 種別
    , contentType TEXT NOT NULL
    -- 説明
    , description TEXT
    -- 付記
    , note TEXT
    -- 発表年
    , publicationYear INTEGER
    -- 発表終了年
    , publicationEndYear INTEGER
    -- 連番
    , seqNo INTEGER
    -- 読了日
    , finishedReading TEXT
    -- 状態
    , status TEXT
)
CREATE UNIQUE INDEX works_index ON works(index);
