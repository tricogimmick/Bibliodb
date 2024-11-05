-- 作品・著作者関連データ
CREATE TABLE works_persons ( 
  -- 作品ID
  workId INTEGER NOT NULL
  -- 並び順
  , orderNo INTEGER NOT NULL
  -- 作家ID
  , personId INTEGER NOT NULL
  -- 作家種別
  , role TEXT
  -- 解説
  , description TEXT
  -- PK
  , PRIMARY KEY (workId, orderNo, personId)
);
