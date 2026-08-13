import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as PersonModel from '../../models/persons'
import pkg from 'sqlite3';

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
	try {
		return {
			persons: await PersonModel.getAll(db)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
		db.close();
	}
};