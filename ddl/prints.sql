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
    -- 出版社(FK - publishers)
    , publisherId INTEGER
    -- ブランド
    , brandId INTEGER
    -- 発行日
    , publicationDate TEXT
    -- 号数
    , issueNumber INTEGER 
    -- シリーズ
    , seriesId INTEGER
    -- 購入日
    , purchaseDate TEXT
    -- 読了日
    , finishedReadingDate TEXT
    -- 説明
    , description TEXT
    -- 目次
    , toc TEXT
    -- メモ
    , note TEXT
    -- 所有種別
    , ownedType TEXT
)
