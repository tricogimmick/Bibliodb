import type { RequestHandler } from './$types';
import type { WorkType } from '../../../types/work';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

export type PostDataType = {
    id: number | null;
    title: string;
    originalTitle: string;
    contentType: string;
    description: string;
    url: string;
    note: string;
    publicationYear: number | null;
    seqNo: number | null;
    relatedPersons: {
        orderNo: number;
        personId: number;
        role: string;
        description: string;
    }[]
};

// 作品の追加
const appendWork = (db: pkg.Database, postData: PostDataType) => new Promise<WorkType|Error>((ok, ng) => {
    db.run("INSERT INTO works (title, originalTitle, contentType, description, url, note, publicationYear, seqNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [ postData.title, postData.originalTitle, postData.contentType, postData.description, postData.url, postData.note, postData.publicationYear, postData.seqNo ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                const workId = this.lastID;
                let err: Error | null = null;
                db.serialize(() => {
                    for (const author of postData.relatedPersons) {
                        db.run("INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                                ["WORK", workId, author.orderNo, author.personId, author.role, author.description],
                            (e) => { err = e });
                        if (err) {
                            break;
                        }
                    }
                    if (err) {
                        ng(err);
                    } else {
                        ok({
                            id: this.lastID,
                            title: postData.title,
                            originalTitle: postData.originalTitle,
                            contentType: postData.contentType,
                            description: postData.description,
                            url: postData.url,
                            note: postData.note,
                            publicationYear: postData.publicationYear,
                            seqNo: postData.seqNo
                        });    
                    }
                });
            }
        }
    );
});

// 作品の更新
const updateWork = (db: pkg.Database, putData: PostDataType) => new Promise<WorkType|Error>((ok, ng) => {
    db.serialize(() => {
        db.run("UPDATE works SET title = ?, originalTitle = ?, contentType = ?, description = ?, url = ?, note = ?, publicationYear = ?, seqNo = ? WHERE id = ?",
            [ putData.title, putData.originalTitle, putData.contentType, putData.description, putData.url, putData.note, putData.publicationYear, putData.seqNo, putData.id ],
            function(error) {
                if (error) {
                    ng(error);
                } else {
                    let err: Error | null = null;
                    db.run("DELETE FROM related_persons WHERE relatedType = 'WORK' AND relatedId = ?", [putData.id], (error2) => {
                        if (error2) {
                            ng(error2);
                        } else {
                            for (const author of putData.relatedPersons) {
                                db.run("INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                                        ['WORK', putData.id, author.orderNo, author.personId, author.role, author.description],
                                    (error3) => { err = error3 });
                                if (err) {
                                    break;
                                }
                            }    
                            if (err) {
                                ng(err);
                            } else {
                                ok({
                                    id: putData.id,
                                    title: putData.title,
                                    originalTitle: putData.originalTitle,
                                    contentType: putData.contentType,
                                    description: putData.description,
                                    url: putData.url,
                                    note: putData.note,
                                    publicationYear: putData.publicationYear,
                                    seqNo: putData.seqNo
                                });    
                            }
                        }
                    });
                }   
            })    
    });
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