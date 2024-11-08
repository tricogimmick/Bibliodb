import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getBrand } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			brand: await getBrand(db, Number(params.id))
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};

