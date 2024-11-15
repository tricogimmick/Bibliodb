import type { RequestHandler } from './$types';
import type { WorkType } from '../../../types/work';
import type { ResultType } from '../../../types/result';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllRows, runSql } from '$lib/common';

export type PostDataType = {
    id: number | null;
    index: string;
    title: string;
    variantTitles: string;
    originalTitle: string;
    contentType: string;
    description: string;
    note: string;
    publicationYear: number | null;
    seqNo: number | null;
    finishedReading: string;
    relatedPersons: {
        orderNo: number;
        personId: number;
        role: string;
        description: string;
    }[],
    relatedLinks: {
        linkType: "IMG" | "LINK";
        url: string;
        alt: string;
        description: string;
    }[],
    relatedSeries: {
        seriesId: number;
        description: string;
    }[],
};

const createWork = (id: number, postData: PostDataType) => ({
    id,
    index: postData.index,
    title: postData.title,
    variantTitles: postData.variantTitles,
    originalTitle: postData.originalTitle,
    contentType: postData.contentType,
    description: postData.description,
    note: postData.note,
    publicationYear: postData.publicationYear,
    seqNo: postData.seqNo,
    finishedReading: postData.finishedReading
});

// 作品の追加
const appendWork = (db: pkg.Database, postData: PostDataType) => new Promise<ResultType<WorkType>>(async (ok, ng) => {
    try {
        const workId = await runSql(db,
            "INSERT INTO works ([index], title, variantTitles, originalTitle, contentType, description, note, publicationYear, seqNo, finishedReading) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.index, postData.title, postData.variantTitles, postData.originalTitle, postData.contentType, postData.description, postData.note, 
              postData.publicationYear, postData.seqNo, postData.finishedReading ]
        );
        for (const relatedPerson of postData.relatedPersons) {
            await runSql(db,
                "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["WORK", workId, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description]);
        }
        for (const relatedLink of postData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["WORK", workId, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        for (const relatedSeries of postData.relatedSeries) {
            await runSql(db,
                "INSERT INTO related_series (relatedType, relatedId, seriesId, description) VALUES (?, ?, ?, ?)",
                ["WORK", workId, relatedSeries.seriesId, relatedSeries.description]);
        }
        ok({ ok: true, data: createWork(workId as number, postData) });
    } catch (e: any) {
        ng({ ok: false, data: (e as Error).message });
    }
});

// 作品の更新
const updateWork = (db: pkg.Database, putData: PostDataType) => new Promise<ResultType<WorkType>>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE works SET [index] = ?, title = ?, variantTitles = ?, originalTitle = ?, contentType = ?, description = ?, note = ?, " +
            "publicationYear = ?, seqNo = ?, finishedReading = ? WHERE id = ?",
            [ putData.index, putData.title, putData.variantTitles, putData.originalTitle, putData.contentType, putData.description, putData.note, 
              putData.publicationYear, putData.seqNo, putData.finishedReading, putData.id ]);
        await runSql(db, "DELETE FROM related_persons WHERE relatedType = 'WORK' AND relatedId = ?", [putData.id]);
        for (const relatedPerson of putData.relatedPersons) {
            await runSql(db,
                "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["WORK", putData.id, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description]);
        }
        await runSql(db, "DELETE FROM related_links WHERE relatedType = 'WORK' AND relatedId = ?", [putData.id]);
        for (const relatedLink of putData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["WORK", putData.id, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        await runSql(db, "DELETE FROM related_series WHERE relatedType = 'WORK' AND relatedId = ?", [putData.id]);
        for (const relatedSeries of putData.relatedSeries) {
            await runSql(db,
                "INSERT INTO related_series (relatedType, relatedId, seriesId, description) VALUES (?, ?, ?, ?)",
                ["WORK", putData.id, relatedSeries.seriesId, relatedSeries.description]);
        }
        ok({ ok: true, data: createWork(putData.id as number, putData)});
    } catch (e: any) {
        ng({ ok: false, data: (e as Error).message });
    }
});

// 作品の取得
const getWorks = (db: pkg.Database, personId: number|null) => new Promise<WorkType[]|Error>(async (ok, ng) => {
    try {
        if (personId) {
            const sql = "SELECT wk.* FROM works as wk " +
                        "JOIN related_persons as rp ON rp.relatedType = 'WORK' AND rp.relatedId = wk.id " +
                        "WHERE rp.personId = ?  ORDER BY wk.title, wk.id";
            const rows = await getAllRows(db, sql, [personId]) as WorkType[];
            ok(rows);    
        } else {
            const rows = await getAllRows(db, "SELECT * FROM works ORDER BY title, id", []) as WorkType[];
            ok(rows);   
        }
    } catch (e: any) {
        ng(e);
    }
})

export const POST: RequestHandler = async ({ request }) => {
	const postData : PostDataType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendWork(db, postData);
        return json(result);
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : PostDataType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updateWork(db, putData);
        return json(result)
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const pid = url.searchParams.get('pid') ?? null;
    const personId = pid ? Number(pid) : null;
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await getWorks(db, personId);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
}