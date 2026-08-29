import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as CollectionsModel from '../../../models/collections';
import * as PrintsModel from '../../../models/prints';
import * as WorksModel from '../../../models/works';


export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env['BIBLIODB_PATH'] ?? '';
    const db = new pkg.Database(dbPath);
    try {
        const collectionId = Number(params.id);
        return {
            collection: await CollectionsModel.get(db, collectionId),
            relatedBooks: await PrintsModel.getRelatedBookListByCollectionId(db, collectionId),
            relatedWorks: await WorksModel.getRelatedWorksByCollectionId(db, collectionId)
        };
    } catch (e) {
        console.log(e);
        error(500, 'Database Error');
    } finally {
        db.close();
    }
};
