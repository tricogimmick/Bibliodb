import type { RequestHandler } from './$types';
import type { PublisherType } from '../../../types/publisher';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as PublisherModel from '../../../models/publishers';
import pkg from 'sqlite3';
const {Database} = pkg;

export const POST: RequestHandler = async ({ request }) => {
	const publisher : PublisherType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await PublisherModel.update(db, publisher);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const publisher : PublisherType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await PublisherModel.update(db, publisher);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await PublisherModel.getAll(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}