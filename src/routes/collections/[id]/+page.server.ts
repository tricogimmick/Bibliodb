import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as CollectionsModel from '../../../models/collections';


export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env['BIBLIODB_PATH'] ?? '';
    const db = new pkg.Database(dbPath);
    try {
        const collectionId = Number(params.id);
        return {
            collection: await CollectionsModel.get(db, collectionId)
        };
    } catch (e) {
        console.log(e);
        error(500, 'Database Error');
    } finally {
        db.close();
    }
};
