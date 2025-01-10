-- 映画マスタ
CREATE TABLE movies (
    -- ID(PK)
    id INTEGER PRIMARY KEY
    -- タイトル
    , title TEXT NOT NULL
    -- 原題
    , originalTitle TEXT
    -- シリーズ
    , seriesId INTEGER
    -- 国
    , country TEXT
    -- 公開年
    , releaseYear TEXT
    -- 説明
    , description TEXT
    -- メモ
    , note TEXT
    -- 視聴日
    , viewingDate TEXT
    -- 視聴方法
    , viewingMethod TEXT
)
