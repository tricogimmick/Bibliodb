import type { PageServerLoad } from './$types';
import type { WorkType } from '../../../types/work';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as WorkModel from '../../../models/works';
import * as PrintModel from '../../../models/prints';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);    
    try {
        const workId = Number(params.id);
		return {
			work: await WorkModel.get(db, workId),
            books: await PrintModel.getRelatedBookListByWorkId(db, workId),
            magazines: await PrintModel.getRelatedMagazineListByWorkId(db, workId)
		};
    } catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};