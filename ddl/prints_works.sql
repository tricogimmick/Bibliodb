-- 印刷物・作品関連データ
CREATE TABLE prints_works ( 
    -- 印刷物ID
    printId INTEGER NOT NULL
    -- 作品ID
    , workId INTEGER NOT NULL
    -- 順序
    , orderNo INTEGER
    -- 副題
    , subTitle TEXT
    -- ページ
    , pageNo INTEGER
    -- 初出区分
    , firstPublished INTEGER DEFAULT 0
    -- 説明
    , description TEXT
    -- PK
    , PRIMARY KEY (printId, workId)
)