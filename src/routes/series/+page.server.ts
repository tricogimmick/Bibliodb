import type { PageServerLoad } from './$types';
import type { SeriesType } from '../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

const getSeries = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<SeriesType[]|Error>((ok, ng) => {
        db.all<SeriesType>("SELECT * FROM series ORDER BY title, id", (err, rows) => {
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
			series: await getSeries()
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};