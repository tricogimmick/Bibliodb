-- 印刷物マスタ
CREATE TABLE "prints" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"originalTitle"	TEXT,
	"printType"	TEXT NOT NULL,
	"publisherId"	INTEGER,
	"brandId"	INTEGER,
	"publicationDate"	TEXT,
	"issueNumber"	INTEGER,
	"seriesId"	INTEGER,
	"purchaseDate"	TEXT,
	"finishedReadingDate"	TEXT,
	"summary"	TEXT,
	"description"	TEXT,
	"toc"	TEXT,
	"note"	TEXT,
	"ownedType"	TEXT,
	PRIMARY KEY("id")
)