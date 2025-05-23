import type { RequestHandler } from './$types';
import type { PrintType } from '../../../types/print';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { runSql } from '$lib/common';

export type PostDataType = {
    id: number | null;
    title: string;
    originalTitle: string;
    printType: string;
    publisherId: number | null;
    brandId: number | null;
    publicationDate: string;
    issueNumber: number | null;
    seriesId: number | null;
    purchaseDate: string;
    finishedReadingDate: string;
    description: string;   
    toc: string;
    note: string;
    ownedType: string; 
    relatedPersons: {
        orderNo: number;
        personId: number;
        role: string;
        description: string;
    }[];
    relatedWorks: {
        subType: string;
        workId: number;
        description: string;
    }[];
    relatedLinks: {
        linkType: "IMG" | "LINK";
        url: string;
        alt: string;
        description: string;
    }[];
    contents: {
        orderNo: number;
        workId: number | null;
        titile: string;
        subTitle: string;
        pageNo: number | null;
        publishType: string;
        serializationStatus: string;
        color: number | null;
        firstPublished: number | null;
        description: string;
    }[];
};

const cretaePostData = (id: number, postData: PostDataType) => ({
    id,
    title: postData.title,
    originalTitle: postData.originalTitle,
    printType: postData.printType,
    publisherId: postData.publisherId,
    brandId: postData.brandId,
    publicationDate: postData.publicationDate,
    issueNumber: postData.issueNumber,
    seriesId: postData.seriesId,
    purchaseDate: postData.purchaseDate,
    finishedReadingDate: postData.finishedReadingDate,
    description: postData.description,
    toc: postData.toc,
    note: postData.note,
    ownedType: postData.ownedType 
});

const appendPrint = (db: pkg.Database, postData: PostDataType) => new Promise<PrintType|Error>(async (ok, ng) => {
    try {
        const printId = await runSql(db, 
            "INSERT INTO prints (title , originalTitle, printType, publisherId, brandId, publicationDate, issueNumber, seriesId, " +
            "purchaseDate, finishedReadingDate, description, toc, note, ownedType) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.title , postData.originalTitle, postData.printType, postData.publisherId, postData.brandId, postData.publicationDate, 
              postData.issueNumber, postData.seriesId,  postData.purchaseDate, postData.finishedReadingDate, postData.description, postData.toc, 
              postData.note, postData.ownedType ]);
        for (const relatedPerson of postData.relatedPersons) {
            await runSql(db, 
                "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PRINT", printId, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description]);
        }
        for (const relatedWork of postData.relatedWorks) {
            await runSql(db, 
                "INSERT INTO related_works (relatedType, subType, relatedId, workId, description) VALUES (?, ?, ?, ?, ?)",
                ["PRINT", relatedWork.subType, printId, relatedWork.workId, relatedWork.description]);
        }
        for (const relatedLink of postData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PRINT", printId, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        for (const content of postData.contents) {
            await runSql(db,
                "INSERT INTO contents (printId, orderNo, workId, titile, subTitle, pageNo, publishType, serializationStatus, color, firstPublished, description) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [printId, content.orderNo, content.workId, content.titile, content.subTitle, content.pageNo, content.publishType, content.serializationStatus, 
                    content.color, content.firstPublished, content.description
                ]);
        }
        ok(cretaePostData(printId as number, postData));
    } catch (error) {
        ng(error);
    }
});

const updatePrint = (db: pkg.Database, putData: PostDataType) => new Promise<PrintType|Error>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE prints SET title = ? , originalTitle = ?, printType = ?, publisherId = ?, brandId = ?, publicationDate = ?, " +
            "issueNumber = ?, seriesId = ?, purchaseDate = ?, finishedReadingDate = ?, description = ?, toc = ?, note = ?, ownedType = ? WHERE id = ?",
            [ putData.title , putData.originalTitle, putData.printType, putData.publisherId, putData.brandId, putData.publicationDate, 
              putData.issueNumber, putData.seriesId, putData.purchaseDate, putData.finishedReadingDate, putData.description, putData.toc, 
              putData.note, putData.ownedType, putData.id ]
        );
        await runSql(db, "DELETE FROM related_persons WHERE relatedType = 'PRINT' AND relatedId = ?", [putData.id]);
        for (const author of putData.relatedPersons) {
            await runSql(db,
                    "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                    ["PRINT", putData.id, author.orderNo, author.personId, author.role, author.description]);
        }    
        await runSql(db, "DELETE FROM related_works WHERE relatedType = 'PRINT' AND relatedId = ?", [putData.id]);
        for (const relatedWork of putData.relatedWorks) {
            await runSql(db, 
                "INSERT INTO related_works (relatedType, subType, relatedId, workId, description) VALUES (?, ?, ?, ?, ?)",
                ["PRINT", relatedWork.subType, putData.id, relatedWork.workId, relatedWork.description]);
        }
        await runSql(db, "DELETE FROM related_links WHERE relatedType = 'PRINT' AND relatedId = ?", [putData.id]);
        for (const relatedLink of putData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PRINT", putData.id, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        await runSql(db, "DELETE FROM contents WHERE printId = ?", [putData.id]);
        for (const content of putData.contents) {
            await runSql(db,
                "INSERT INTO contents (printId, orderNo, workId, title, subTitle, pageNo, publishType, serializationStatus, color, firstPublished, description) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [putData.id, content.orderNo, content.workId, content.titile, content.subTitle, content.pageNo, content.publishType, content.serializationStatus, 
                    content.color, content.firstPublished, content.description
                ]);
        }
        ok(cretaePostData(putData.id as number, putData));    
    } catch (error) {
        ng(error);
    }
});

export const POST: RequestHandler = async ({ request }) => {
	const postData : PostDataType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
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
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updatePrint(db, putData);
        return json(result)
    } finally {
        db.close();
    }
};