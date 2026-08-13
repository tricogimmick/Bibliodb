import type { RequestHandler } from './$types';
import type { PersonType  } from '../../../types/person';
import type { ResultType } from '../../../types/result';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PersonModel from '../../../models/persons';

import { getAllPersons, runSql } from '$lib/common';

export const POST: RequestHandler = async ({ request }) => {
	const postData : PersonType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await PersonModel.update(db, postData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : PersonType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await PersonModel.update(db, putData);
        return json({ ok: true, data: result })
    } catch (e: unknown) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);
    try {
        const result = await getAllPersons(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}
