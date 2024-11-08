import type { RequestHandler } from './$types';
import type { PrintType } from '../../../types/print';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

export type PostDataType = {
    id: number | null;
    title: string;
    originalTitle: string;
    printType: string;
    publisherId: number | null;
    brandId: number | null;
    publicationDate: string;
    seriesId: number | null;
    description: string;   
    ndl: string;
    ownedType: string; 
    relatedPersons: {
        orderNo: number;
        personId: number;
        role: string;
        description: string;
    }[]
};

const appendPrint = (db: pkg.Database, postData: PostDataType) => new Promise<PrintType|Error>((ok, ng) => {
    db.serialize(() => {
        db.run("INSERT INTO prints (title , originalTitle, printType, publisherId, brandId, publicationDate, seriesId, description, ndl , ownedType) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.title , postData.originalTitle, postData.printType, postData.publisherId, postData.brandId, postData.publicationDate, 
              postData.seriesId, postData.description, postData.ndl , postData.ownedType ],
            function(error) {
                if (error) {
                    ng(error);
                } else {
                    const printId = this.lastID;
                    let err: Error | null = null;
                    for (const author of postData.relatedPersons) {
                        db.run("INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                                ["PRINT", printId, author.orderNo, author.personId, author.role, author.description],
                            (e) => { err = e });
                        if (err) {
                            break;
                        }
                    }
                    if (err) {
                        ng(err);
                    } else {
                        ok({
                            id: printId,
                            title: postData.title,
                            originalTitle: postData.originalTitle,
                            printType: postData.printType,
                            publisherId: postData.publisherId,
                            brandId: postData.brandId,
                            publicationDate: postData.publicationDate,
                            seriesId: postData.seriesId,
                            description: postData.description,
                            ndl: postData.ndl,
                            ownedType: postData.ownedType 
                        });    
                    }
                }
            }
        );
    });
});

const updatePrint = (db: pkg.Database, putData: PostDataType) => new Promise<PrintType|Error>((ok, ng) => {
    db.serialize(() => {
        db.run("UPDATE prints SET title = ? , originalTitle = ?, printType = ?, publisherId = ?, brandId = ?, publicationDate = ?, " +
               "seriesId = ?, description = ?, ndl = ?, ownedType = ? WHERE id = ?",
            [ putData.title , putData.originalTitle, putData.printType, putData.publisherId, putData.brandId, putData.publicationDate, 
                putData.seriesId, putData.description, putData.ndl , putData.ownedType, putData.id ],
            function(error) {
                if (error) {
                    ng(error);
                } else {
                    let err: Error | null = null;
                    db.run("DELETE FROM related_persons WHERE relatedType = 'PRINT' AND relatedId = ?", [putData.id], (error2) => {
                        if (error2) {
                            ng(error2);
                        } else {
                            for (const author of putData.relatedPersons) {
                                db.run("INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                                        ["PRINT", putData.id, author.orderNo, author.personId, author.role, author.description],
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
                                    printType: putData.printType,
                                    publisherId: putData.publisherId,
                                    brandId: putData.brandId,
                                    publicationDate: putData.publicationDate,
                                    seriesId: putData.seriesId,
                                    description: putData.description,
                                    ndl: putData.ndl,
                                    ownedType: putData.ownedType 
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
        const result = await appendPrint(db, postData);
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
        const result = await updatePrint(db, putData);
        return json(result)
    } finally {
        db.close();
    }
};