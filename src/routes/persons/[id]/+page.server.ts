import type { PageServerLoad } from './$types';
import type { PersonType  } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// 人物を取得
const getPerson = (id: string) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<PersonType|Error>((ok, ng) => {
        db.get<PersonType>("SELECT * FROM persons WHERE id = ?", [id], (err, row) => {
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
			persons: await getPerson(params.id)
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};

