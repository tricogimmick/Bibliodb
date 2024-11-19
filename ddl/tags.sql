-- タグマスタ
CREATE TABLE tags (
    -- ID (PK)
    id INTEGER PRIMARY KEY
    -- タグ
    , tag TEXT NOT NULL
);
CREATE UNIQUE INDEX tags_tag ON tags(tag);
