import type { PageServerLoad } from '../$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PersonsModel from '../../../../models/persons';


export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
	try {
		return {
			person: await PersonsModel.get(db, Number(params.id))
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
		db.close();
	}
};

