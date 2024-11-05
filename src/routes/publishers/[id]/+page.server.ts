import type { PageServerLoad } from './$types';
import type { PublisherType } from '../../../types/publisher';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;


const getPublisher = (id: string) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<PublisherType|Error>((ok, ng) => {
        db.get<PublisherType>("SELECT * FROM publishers WHERE id = ?", [id], (err, row) => {
            if (err) {
                ng(err);
            } else {
                ok(row);
            }
        });
	})
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			publisher: await getPublisher(params.id)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};