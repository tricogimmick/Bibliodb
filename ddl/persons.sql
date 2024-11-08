-- 著作者マスタ
CREATE TABLE persons ( 
  -- ID(PK)
  id INTEGER PRIMARY KEY 
  -- INDEX
  , index TEXT NOT NULL
  -- 氏名
  , name TEXT NOT NULL
  -- ふりがな
  , kana TEXT
  -- 生年月日
  , born TEXT
  -- 没年月日
  , died TEXT
  -- 説明
  , description TEXT
);
CREATE UNIQUE INDEX persons_index ON persons(index);
