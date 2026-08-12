import type { RequestHandler } from './$types';
import type { SeriesType } from '../../../types/series';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as SeriesModel from '../../../models/series';
import pkg from 'sqlite3';
const {Database} = pkg;


import { getAllSeries } from '$lib/common';

export const POST: RequestHandler = async ({ request }) => {
	const series : SeriesType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await SeriesModel.update(db, series);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const series : SeriesType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await SeriesModel.update(db, series);
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
        const result = await SeriesModel.getAll(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}
