import type { PageServerLoad } from './$types';
import type { SeriesType } from '../../../types/series';
import type { PrintViewType } from '../../../types/print';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as SeriesModel from '../../../models/series';
import * as PrintModel from '../../../models/prints';

import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		const seriesId = Number(params.id);
		const series: SeriesType = await SeriesModel.get(db, seriesId);
        const relatedPrints: PrintViewType[] = await PrintModel.getRelatedPrintsBySeriesId(db, seriesId);
        return {
            series,
            relatedPrints
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};