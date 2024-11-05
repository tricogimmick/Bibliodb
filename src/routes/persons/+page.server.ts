import { error } from '@sveltejs/kit';
import pkg from 'sqlite3';
import { env } from '$env/dynamic/private';

import type { PageServerLoad } from './$types';
import type { PersonType  } from '../../types/person';

const {Database} = pkg;


const getPersons = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<PersonType[]|Error>((ok, ng) => {
        db.all<PersonType>("SELECT * FROM persons ORDER BY kana, id", (err, rows) => {
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
			persons: await getPersons()
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	}
};