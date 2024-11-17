-- 掲載情報データ
CREATE TABLE contents ( 
    -- 印刷物ID
    printId INTEGER NOT NULL
    -- 順序
    , orderNo INTEGER NOT NULL
    -- 作品ID
    , workId INTEGER NOT NULL
    -- タイトル
    , title TEXT
    -- 副題
    , subTitle TEXT
    -- ページ
    , pageNo INTEGER
    -- 掲載種別
    , publishType TEXT
    -- 連載状態
    , serializationStatus TEXT
    -- カラー
    , color INTEGER DEFAULT 0
    -- 初出区分
    , firstPublished INTEGER DEFAULT 0
    -- 説明
    , description TEXT
    -- PK
    , PRIMARY KEY (printId, orderNo)
);
CREATE INDEX contents_workId ON contents(workId, printId, orderNo);
