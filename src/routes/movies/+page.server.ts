import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

type QueryResultType = {
	id: number | null;
	seriesId: number | null;
	seriesName: string;
    title: string;
	releaseYear: string;
}

const getMovies = (db: pkg.Database) => new Promise<QueryResultType[]|Error>((ok, ng) => {
	db.all<QueryResultType>(
		"SELECT m.id, m.seriesId, s.title as seriesName, m.title, m.releaseYear FROM movies as m " +
		"LEFT JOIN series as s on s.id = m.seriesId ORDER BY m.releaseYear desc, s.title, m.title", [],
		(err, rows) => {
			if (err) {
				ng()
			} else {
				ok(rows);
			}
		});
});

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			movies: await getMovies(db)
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};