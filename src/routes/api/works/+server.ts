import type { RequestHandler } from './$types';
import type { WorkType } from '../../../types/work';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { runSql } from '$lib/common';

export type PostDataType = {
    id: number | null;
    title: string;
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
    }[]
};

const createWork = (id: number, postData: PostDataType) => ({
    id,
    title: postData.title,
    originalTitle: postData.originalTitle,
    contentType: postData.contentType,
    description: postData.description,
    note: postData.note,
    publicationYear: postData.publicationYear,
    seqNo: postData.seqNo,
    finishedReading: postData.finishedReading
});

// 作品の追加
const appendWork = (db: pkg.Database, postData: PostDataType) => new Promise<WorkType|Error>(async (ok, ng) => {
    try {
        const workId = await runSql(db,
            "INSERT INTO works (title, originalTitle, contentType, description, note, publicationYear, seqNo, finishedReading) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.title, postData.originalTitle, postData.contentType, postData.description, postData.note, 
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
        ok(createWork(workId as number, postData));
    } catch (e: any) {
        ng(e);
    }
});

// 作品の更新
const updateWork = (db: pkg.Database, putData: PostDataType) => new Promise<WorkType|Error>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE works SET title = ?, originalTitle = ?, contentType = ?, description = ?, note = ?, " +
            "publicationYear = ?, seqNo = ?, finishedReading = ? WHERE id = ?",
            [ putData.title, putData.originalTitle, putData.contentType, putData.description, putData.note, 
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
        ok(createWork(putData.id as number, putData));
    } catch (e: any) {
        ng(e);
    }
});

export const POST: RequestHandler = async ({ request }) => {
	const postData : PostDataType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendWork(db, postData);
        return json(result)
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