import type { PageServerLoad } from './$types';
import type { SeriesType } from '../../types/series';
import type { BookListType } from '../../types/bookList';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllSeries, getAllBookLists } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			series: await getAllSeries(db),
			bookLists: await getAllBookLists(db)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
		db.close();
	}
};