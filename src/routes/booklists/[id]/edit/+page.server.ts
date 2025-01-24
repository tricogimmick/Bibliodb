import type { PageServerLoad } from '../$types';
import type { BookListType } from '../../../../types/bookList';
import type { SeriesType } from '../../../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getBookList, getAllSeries } from '$lib/common';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
      bookList: await getBookList(db, Number(params.id)) as BookListType,
      series: await getAllSeries(db) as SeriesType[]
		};
    } catch (e) {
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};