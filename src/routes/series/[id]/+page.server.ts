import type { PageServerLoad } from './$types';
import type { PublisherType } from '../../../types/publisher';
import type { SeriesType } from '../../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// シリーズを取得する
const getSeries = (id: string) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<SeriesType|Error>((ok, ng) => {
        db.get<SeriesType>("SELECT * FROM series WHERE id = ?", [id], (err, row) => {
            if (err) {
                ng(err);
            } else {
                ok(row);
            }
        });
	})
};

// 出版社を取得
const getPublishers = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
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


export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			series: await getSeries(params.id),
			publishers: await getPublishers()
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};