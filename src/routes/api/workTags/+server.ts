import type { RequestHandler } from './$types';
import type { ResultType } from '../../../types/result';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllRows } from '$lib/common';

export type WorkTagType = {
    workId: number;
    index: string;
    title: string;
    personId: number | null;
};

// 作品タグの取得
const getWorkTags = (db: pkg.Database) => new Promise<WorkTagType[]|Error>(async (ok, ng) => {
    try {
        const sql = "SELECT wk.id as workId, wk.[index], wk.title, rp.personId FROM works as wk " +
                    "JOIN related_persons as rp ON rp.relatedType = 'WORK' AND rp.relatedId = wk.id ";
        const rows = await getAllRows(db, sql, []) as WorkTagType[];
        ok(rows);    
    } catch (e: any) {
        ng(e);
    }
})

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await getWorkTags(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
}