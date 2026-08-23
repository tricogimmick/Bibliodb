import type { RequestHandler } from './$types';
import type { CollectionType } from '../../../types/collection';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as CollectionsModel from '../../../models/collections';


export const POST: RequestHandler = async ({ request }) => {
	const postData : CollectionType = await request.json();
    const dbPath = env['BIBLIODB_PATH'] ?? '';
    const db = new pkg.Database(dbPath);
    try {
        const result = await CollectionsModel.update(db, postData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : CollectionType = await request.json();
    const dbPath = env['BIBLIODB_PATH'] ?? '';
    const db = new pkg.Database(dbPath);
    try {
        const result = await CollectionsModel.update(db, putData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};
