import type { PublisherType } from '../types/publisher';
import type { BrandType } from '../types/brand';
import type { SeriesType } from '../types/series';
import type { PersonType } from '../types/person';
import type { WorkType } from '../types/work';
import type { PrintType } from '../types/print';
import type { ContentType } from '../types/content';
import type { RelatedPeronsType } from '../types/relatedPersons';
import type { RelatedLinksType } from '../types/relatedLinks';
import type { RelatedSeriesType } from '../types/relatedSeries';
import type { RelatedWorksType } from '../types/relatedWorks';
import type { ResultType } from '../types/result';
import pkg from 'sqlite3';

// SQLの実行
export const runSql = (db: pkg.Database, sql: string, params: any) =>  new Promise<number>((ok, ng) => {
    db.run(sql, params, function(error) {
        if (error) {
            ng(error);
        } else {
            ok(this.lastID);
        }
    });
});

// DBより1行取得する
export function getRow<T>(db: pkg.Database, sql: string, params: any) {
    return new Promise<T>((ok, ng) => {
        db.get<T>(sql, params, (error, row) => {
            if (error) {
                ng(error);
            } else {
                ok(row);
            }
        });
    }); 
}

// DBより全行取得する
export function getAllRows<T>(db: pkg.Database, sql: string, params: any) {
    return new Promise<T[]>((ok, ng) => {
        db.all<T>(sql, params, (error, rows) => {
            if (error) {
                ng(error);
            } else {
                ok(rows);
            }
        });
    }); 
}

// 全ての出版社を取得
export const getAllPublishers = (db: pkg.Database) => new Promise<PublisherType[]|Error>((ok, ng) => {
    db.all<PublisherType>("SELECT * FROM publishers ORDER BY name, id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 出版社を取得
export const getPublisher = (db: pkg.Database, id: number) => new Promise<PublisherType|Error>((ok, ng) => {
    db.get<PublisherType>("SELECT * FROM publishers WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全てのブランドを取得
export const getAllBrands = (db: pkg.Database) => new Promise<BrandType[]|Error>((ok, ng) => {
    db.all<BrandType>("SELECT * FROM brands ORDER BY name, id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// ブランドを取得
export const getBrand = (db: pkg.Database, id: number) => new Promise<BrandType|Error>((ok, ng) => {
    db.get<BrandType>("SELECT * FROM brands WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全てのシリーズを取得
export const getAllSeries = (db: pkg.Database) => new Promise<SeriesType[]|Error>((ok, ng) => {
    db.all<SeriesType>("SELECT * FROM series ORDER BY [index], id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// シリーズを取得する
export const getSeries = (db: pkg.Database, id: number) => new Promise<SeriesType|Error>((ok, ng) => {
    db.get<SeriesType>("SELECT * FROM series WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全ての人物を取得
export const getAllPersons = (db: pkg.Database) => new Promise<PersonType[]|Error>((ok, ng) => {
    db.all<PersonType>("SELECT * FROM persons ORDER BY [index], id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });});

// 人物を取得
export const getPerson = (db: pkg.Database, id: number) => new Promise<PersonType|Error>((ok, ng) => {
    db.get<PersonType>("SELECT * FROM persons WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 作品を取得
export const getWork = (db: pkg.Database, id: number) => new Promise<WorkType|Error>((ok, ng) => {
    db.get<WorkType>("SELECT * FROM works WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全ての作品を取得
export const getAllWorks = (db: pkg.Database) => new Promise<WorkType[]|Error>((ok, ng) => {
    db.all<WorkType>("SELECT * FROM works order by id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});


// 出版物を取得
export const getPrint = (db: pkg.Database, id: number) => new Promise<PrintType|Error>((ok, ng) => {
    db.get<PrintType>("SELECT * FROM prints WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 出版物・作品を全て取得
export const getContents = (db: pkg.Database, printId: number) => new Promise<ContentType[]|Error>((ok, ng) => {
    db.all<ContentType>("SELECT * FROM contents WHERE printId = ?", [printId], (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 関連人物を全て取得
export const getAllRelatedPersons = (db: pkg.Database, relatedType: string, relatedId: number|null ) => new Promise<RelatedPeronsType[]|Error>((ok, ng) => {
    const sql = relatedId != null ? 
                "SELECT * FROM related_persons WHERE relatedType = ? AND relatedId = ?" : 
                "SELECT * FROM related_persons WHERE relatedType = ?";
    const params = relatedId != null ? [relatedType, relatedId] : [relatedType]
    db.all<RelatedPeronsType>(sql, params, (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 関連リンクを全て取得
export const getAllRelatedLinks = (db: pkg.Database, relatedType: string, relatedId: number ) => new Promise<RelatedLinksType[]|Error>((ok, ng) => {
    db.all<RelatedLinksType>("SELECT * FROM related_links WHERE relatedType = ? AND relatedId = ?", [relatedType, relatedId], (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 関連シリーズを全て取得
export const getAllRelatedSeries = (db: pkg.Database, relatedType: string, relatedId: number ) => new Promise<RelatedSeriesType[]|Error>((ok, ng) => {
    db.all<RelatedSeriesType>("SELECT * FROM related_series WHERE relatedType = ? AND relatedId = ?", [relatedType, relatedId], (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 関連作品を全て取得
export const getAllRelatedWorks = (db: pkg.Database, relatedType: string, subType: string, relatedId: number ) => new Promise<RelatedWorksType[]|Error>((ok, ng) => {
    db.all<RelatedWorksType>("SELECT * FROM related_works WHERE relatedType = ? AND subType = ? AND relatedId = ?", [relatedType, subType, relatedId], (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 関連タグを全て取得
type tagDisplayType = {
    tag: string;
}
export const getAllRelatedTags = (db: pkg.Database, relatedType: string, relatedId: number ) => new Promise<string[]|Error>((ok, ng) => {
    db.all<tagDisplayType>(
        "SELECT t.tag FROM related_tags as r " +
        "JOIN tags as t ON t.id = r.tagId WHERE r.relatedType = ? AND relatedId = ?",
        [relatedType, relatedId],
        (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows.map(x => x.tag));
            }
        }
    )
})
