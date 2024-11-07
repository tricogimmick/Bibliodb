import type { PageServerLoad } from '../$types';
import type { PublisherType } from '../../../../types/publisher';
import type { SeriesType } from '../../../../types/series';
import type { PersonType } from '../../../../types/person';
import type { PrintType } from '../../../../types/print';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// 出版社を取得
const getPublishers = (db: pkg.Database) => {
	return new Promise<PublisherType[]|Error>((ok, ng) => {
        db.all<PublisherType>("SELECT * FROM publishers ORDER BY name, id", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

// シリーズを取得
const getSeries = (db: pkg.Database) => {
	return new Promise<SeriesType[]|Error>((ok, ng) => {
        db.all<SeriesType>("SELECT * FROM series ORDER BY nameIndex, id", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

// 人物を取得
const getPersons = (db: pkg.Database) => {
	return new Promise<PersonType[]|Error>((ok, ng) => {
        db.all<PersonType>("SELECT * FROM persons ORDER BY nameIndex, id", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

// 出版物を取得
const getPrint = (id: number, db: pkg.Database) => {
	return new Promise<PrintType|Error>((ok, ng) => {
        db.get<PrintType>("SELECT * FROM prints WHERE id = ?", [id], (err, row) => {
            if (err) {
                ng(err);
            } else {
                ok(row);
            }
        });
	})
};

// 著作者を取得
const getRelatedPersons = (id: number, db: pkg.Database) => {
	return new Promise<RelatedPeronsType[]|Error>((ok, ng) => {
        db.all<RelatedPeronsType>("SELECT * FROM related_persons WHERE relatedType = 'PRINT' AND relatedId = ?", [id], (err, rows) => {
            if (err) {
                ng(err);
            } else {
                if (rows.length === 0) {
                    rows.push({
                        relatedType: "PRINT",
                        relatedId: null,
                        orderNo: 1,
                        personId: null,
                        role: "作者",
                        description: ""            
                    });
                }
                ok(rows);
            }
        });
	})
};

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
            publishers: await getPublishers(db) as PublisherType[],
            series: await getSeries(db) as SeriesType[],
			persons: await getPersons(db) as PersonType[],
            print: await getPrint(Number(params.id), db) as PrintType,
            relatedPersons: await getRelatedPersons(Number(params.id), db) as RelatedPeronsType[]
		};
    } catch (e) {
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};