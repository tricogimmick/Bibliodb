import type { PageServerLoad } from './$types';
import type { PublisherType } from '../../../types/publisher';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// 出版社を取得
const getPublishers = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<PublisherType[]|Error>((ok, ng) => {
        db.all<PublisherType>("SELECT * FROM publishers ORDER BY name, id", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			publishers: await getPublishers()
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};