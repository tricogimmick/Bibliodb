import type { RequestHandler } from './$types';
import type { BrandType } from '../../../types/brand';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllBrands } from '$lib/common';

const appendBrand = (db: pkg.Database, brand: BrandType) => new Promise<BrandType|Error>((ok, ng) => {
    db.run("INSERT INTO brands (name, description) VALUES (?, ?)",
        [ brand.name, brand.description ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok({
                    id: this.lastID,
                    name: brand.name,
                    description: brand.description
                });
            }
        }
    );
});

const updateBrand = (db: pkg.Database, brand: BrandType) => new Promise<BrandType|Error>((ok, ng) => {
    db.run("UPDATE brands SET name = ?, description = ? WHERE id = ?",
        [ brand.name, brand.description, brand.id ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok(brand);
            }
        }
    );
});

export const POST: RequestHandler = async ({ request }) => {
	const brand : BrandType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendBrand(db, brand);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const brand : BrandType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updateBrand(db, brand);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await getAllBrands(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}