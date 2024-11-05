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
    authors: {
            orderNo: number;
            personId: number;
            role: string;
            description: string;
    }[]
};


const appendWork = (db: pkg.Database, postData: PostDataType) => new Promise<WorkType|Error>((ok, ng) => {
    db.run("INSERT INTO works (title, originalTitle, contentType, description, url, note) VALUES (?, ?, ?, ?, ?, ?)",
        [ postData.title, postData.originalTitle, postData.contentType, postData.description, postData.url, postData.note ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                const workId = this.lastID;
                let err: Error | null = null;
                db.serialize(() => {
                    for (const author of postData.authors) {
                        db.run("INSERT INTO works_persons (workId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?)",
                                [workId, author.orderNo, author.personId, author.role, author.description],
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
                            note: postData.note
                        });    
                    }
                });
            }
        }
    );
});

const updateWork = (db: pkg.Database, putData: PostDataType) => new Promise<WorkType|Error>((ok, ng) => {
    db.serialize(() => {
        db.run("UPDATE works SET title = ?, originalTitle = ?, contentType = ?, description = ?, url = ?, note = ? WHERE id = ?",
            [ putData.title, putData.originalTitle, putData.contentType, putData.description, putData.url, putData.note, putData.id ],
            function(error) {
                if (error) {
                    ng(error);
                } else {
                    let err: Error | null = null;
                    db.run("DELETE FROM works_persons WHERE workId = ?", [putData.id], (error2) => {
                        if (error2) {
                            ng(error2);
                        } else {
                            for (const author of putData.authors) {
                                db.run("INSERT INTO works_persons (workId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?)",
                                        [putData.id, author.orderNo, author.personId, author.role, author.description],
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
                                    note: putData.note
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
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
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
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};