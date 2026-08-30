import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as CollectonsModel from '../../models/collections'
import * as SeriesModel from '../../models/series';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        return {
            collections: await CollectonsModel.getAll(db),
            series: await SeriesModel.getAll(db)
        };
    } catch (e) {
        console.log(e);
        error(500, { message: 'Database Error' });
    } finally {
        db.close();
    }
};