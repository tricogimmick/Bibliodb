import type { PublisherType } from '../types/publisher';
import type { BrandType } from '../types/brand';
import type { SeriesType } from '../types/series';
import type { PersonType } from '../types/person';
import type { WorkType } from '../types/work';
import type { PrintType } from '../types/print';
import type { RelatedPeronsType } from '../types/relatedPersons';
import type { Database } from 'sqlite3';
import { installPolyfills } from '@sveltejs/kit/node/polyfills';

// 全ての出版社を取得
export const getAllPublishers = (db: Database) => new Promise<PublisherType[]|Error>((ok, ng) => {
    db.all<PublisherType>("SELECT * FROM publishers ORDER BY name, id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// 出版社を取得
export const getPublisher = (db: Database, id: number) => new Promise<PublisherType|Error>((ok, ng) => {
    db.get<PublisherType>("SELECT * FROM publishers WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全てのブランドを取得
export const getAllBrands = (db: Database) => new Promise<BrandType[]|Error>((ok, ng) => {
    db.all<BrandType>("SELECT * FROM brands ORDER BY name, id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// ブランドを取得
export const getBrand = (db: Database, id: number) => new Promise<BrandType|Error>((ok, ng) => {
    db.get<BrandType>("SELECT * FROM brands WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全てのシリーズを取得
export const getAllSeries = (db: Database) => new Promise<SeriesType[]|Error>((ok, ng) => {
    db.all<SeriesType>("SELECT * FROM series ORDER BY [index], id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});

// シリーズを取得する
export const getSeries = (db: Database, id: number) => new Promise<SeriesType|Error>((ok, ng) => {
    db.get<SeriesType>("SELECT * FROM series WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 全て人物を取得
export const getAllPersons = (db: Database) => new Promise<PersonType[]|Error>((ok, ng) => {
    db.all<PersonType>("SELECT * FROM persons ORDER BY [index], id", (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });});

// 人物を取得
export const getPerson = (db: Database, id: number) => new Promise<PersonType|Error>((ok, ng) => {
    db.get<PersonType>("SELECT * FROM persons WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 作品を取得
export const getWork = (db: Database, id: number) => new Promise<WorkType|Error>((ok, ng) => {
    db.get<WorkType>("SELECT * FROM works WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 出版物を取得
export const getPrint = (db: Database, id: number) => new Promise<PrintType|Error>((ok, ng) => {
    db.get<PrintType>("SELECT * FROM prints WHERE id = ?", [id], (err, row) => {
        if (err) {
            ng(err);
        } else {
            ok(row);
        }
    });
});

// 関連人物を全て取得
export const getAllRelatedPersons = (db: Database, relatedType: string, relatedId: number, ) => new Promise<RelatedPeronsType[]|Error>((ok, ng) => {
    db.all<RelatedPeronsType>("SELECT * FROM related_persons WHERE relatedType = ? AND relatedId = ?", [relatedType, relatedId], (err, rows) => {
        if (err) {
            ng(err);
        } else {
            ok(rows);
        }
    });
});