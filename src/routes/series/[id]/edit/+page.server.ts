import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllPublishers, getSeries } from '$lib/common';
import pkg from 'sqlite3';
import type { SeriesType } from '../../../../types/series';
import type { PublisherType } from '../../../../types/publisher';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			series: await getSeries(db, Number(params.id)) as SeriesType,
			publishers: await getAllPublishers(db) as PublisherType[]
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};