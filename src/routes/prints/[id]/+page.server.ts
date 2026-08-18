import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PrintsModel from '../../../models/prints';
import * as ContentsModel from '../../../models/contents';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);    
    try {
        const printId = Number(params.id);
		return {
			print: await PrintsModel.get(db, printId),
            contents: await ContentsModel.getListViewByPrint(db, printId) 
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};