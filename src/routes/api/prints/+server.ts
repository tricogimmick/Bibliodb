import type { RequestHandler } from './$types';
import type { PrintType } from '../../../types/print';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PrintsModel from '../../../models/prints';

export const POST: RequestHandler = async ({ request }) => {
	const postData : PrintType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await PrintsModel.update(db, postData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : PrintType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await PrintsModel.update(db, putData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};