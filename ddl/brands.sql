-- ブランドマスタ
CREATE TABLE brands (
    -- ID (PK)
    id INTEGER PRIMARY KEY
    -- ブランド名
    , name TEXT NOT NULL
    -- 説明
    , description TEXT
);
CREATE UNIQUE INDEX brands_name ON brands(name);
