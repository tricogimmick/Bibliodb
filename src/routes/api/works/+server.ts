import type { RequestHandler } from './$types';
import type { WorkType } from '../../../types/work';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as WorksModel from '../../../models/works'

export const POST: RequestHandler = async ({ request }) => {
	const workData : WorkType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await WorksModel.update(db, workData);
        return json(result);
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const workData : WorkType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await WorksModel.update(db, workData);
        return json(result)
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const pid = url.searchParams.get('pid') ?? null;
    const personId = pid ? Number(pid) : null;
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = personId != null ? await WorksModel.getAllByPerson(db, personId) : await WorksModel.getAll(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
}