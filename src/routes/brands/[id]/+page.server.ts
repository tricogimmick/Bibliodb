import type { PageServerLoad } from './$types';
import type { BrandType } from '../../../types/brand';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// ブランドを取得
const getBrand = (id: number) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<BrandType|Error>((ok, ng) => {
        db.get<BrandType>("SELECT * FROM brands WHERE id = ?", [id], (err, row) => {
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
			brand: await getBrand(Number(params.id))
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	}
};

