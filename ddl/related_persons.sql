-- 関連人物データ
CREATE TABLE related_persons ( 
  -- 関連先種別
  relatedType TEXT NOT NULL
  -- 関連先ID
  , relatedId INTEGER NOT NULL
  -- 並び順
  , orderNo INTEGER NOT NULL
  -- 作家ID
  , personId INTEGER NOT NULL
  -- 作家種別
  , role TEXT
  -- 解説
  , description TEXT
  -- PK
  , PRIMARY KEY (relatedType, relatedId, orderNo, personId)
);
CREATE INDEX related_persons_personId ON related_persons(personId, relatedType, relatedId);
