import type { PageServerLoad } from './$types';
import type { PublisherType } from '../../../types/publisher';
import type { SeriesType } from '../../../types/series';
import type { PersonType } from '../../../types/person';

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

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
            publishers: await getPublishers(db) as PublisherType[],
            series: await getSeries(db) as SeriesType[],
			persons: await getPersons(db) as PersonType[]
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};