import type { PageServerLoad } from './$types';
import type { SeriesType } from '../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllSeries } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			series: await getAllSeries(db)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
		db.close();
	}
};