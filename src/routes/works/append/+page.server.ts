import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllPersons } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			persons: await getAllPersons(db)
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};