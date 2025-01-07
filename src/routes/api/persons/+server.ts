import type { RequestHandler } from './$types';
import type { PersonType  } from '../../../types/person';
import type { ResultType } from '../../../types/result';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllPersons, runSql } from '$lib/common';

export type PostDataType = {
    id: number | null;
    index: string;
    name: string;
    kana: string;
    born: string;
    died: string;
    description: string;
    relatedLinks: {
        linkType: "IMG" | "LINK";
        url: string;
        alt: string;
        description: string;
    }[];
};

const createPerson = (id: number, postData: PostDataType) => ({
    id,
    index: postData.index,
    name: postData.name,
    kana: postData.kana,
    born: postData.born,
    died: postData.died,
    description: postData.description
} as PersonType);

const appendPerson = (db: pkg.Database, postData: PostDataType) => new Promise<ResultType<PersonType>>(async (ok, ng) => {
    try {
        const personId = await runSql(db, 
            "INSERT INTO persons ([index], name, kana, born, died, description) VALUES (?, ?, ?, ?, ?, ?)",
            [ postData.index, postData.name, postData.kana, postData.born, postData.died, postData.description ]
        );
        for (const relatedLink of postData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PERSON", personId, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        ok({ ok: true, data: createPerson(personId, postData) });
    } catch (e: any) {
        ng({ ok: false, data: (e as Error).message });
    }
});

const updatePerson = (db: pkg.Database, putData: PostDataType) => new Promise<ResultType<PersonType>>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE persons SET [index] = ?, name = ?, kana = ?, born = ?, died = ?, description = ? WHERE id = ?",
            [ putData.index, putData.name, putData.kana, putData.born, putData.died, putData.description, putData.id ]
        );
        await runSql(db, "DELETE FROM related_links WHERE relatedType = 'PERSON' AND relatedId = ?", [putData.id]);
        for (const relatedLink of putData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PERSON", putData.id, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        ok({ ok: true, data: createPerson(putData.id as number, putData)});
    } catch (e: any) {
        ng({ ok: false, data: (e as Error).message });
    }
});

export const POST: RequestHandler = async ({ request }) => {
	const postData : PostDataType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendPerson(db, postData);
        return json(result);
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : PostDataType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updatePerson(db, putData);
        return json(result);
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await getAllPersons(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}
