import type { PageServerLoad } from './$types';
import type { SeriesType } from '../../../../types/series';
import type { PublisherType } from '../../../../types/publisher';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as SeriesModel from '../../../../models/series';
import * as PublisherModel from '../../../../models/publishers';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			series: await SeriesModel.get(db, Number(params.id)),
			publishers: await PublisherModel.getAll(db)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};