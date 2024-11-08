import type { PageServerLoad } from './$types';
import type { PublisherType } from '../../../types/publisher';
import type { BrandType } from '../../../types/brand';
import type { SeriesType } from '../../../types/series';
import type { PersonType } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllPublishers, getAllBrands, getAllSeries, getAllPersons } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
            publishers: await getAllPublishers(db) as PublisherType[],
            brands: await getAllBrands(db) as BrandType[],
            series: await getAllSeries(db) as SeriesType[],
			persons: await getAllPersons(db) as PersonType[]
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};