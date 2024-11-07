import type { PageServerLoad } from './$types';
import type { BrandType } from '../../types/brand';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

const getBrands = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<BrandType[]|Error>((ok, ng) => {
        db.all<BrandType>("SELECT * FROM brands ORDER BY name", (err, rows) => {
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
			brands: await getBrands()
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	}
};