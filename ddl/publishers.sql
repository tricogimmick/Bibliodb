-- 出版社マスタ
CREATE TABLE publishers (
    -- ID (PK)
    id INTEGER PRIMARY KEY
    -- 出版社名
    , name TEXT NOT NULL
    -- 説明
    , description TEXT
)
CREATE UNIQUE INDEX publishers_name ON publishers(name);
