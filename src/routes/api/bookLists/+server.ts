import type { RequestHandler } from './$types';
import type { BookListType } from '../../../types/bookList';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { runSql } from '$lib/common';

const appendBookList = (db: pkg.Database, postData: BookListType) => new Promise<BookListType|Error>(async (ok, ng) => {
    try {
        const listId = await runSql(db, 
            "INSERT INTO book_lists (dataType, seriesId, year, issue, title, authors, publisher, url, description) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.dataType, postData.seriesId, postData.year, postData.issue, postData.title, postData.authors, postData.publisher, postData.url, postData.description ]);
            postData.id = listId as number;
        ok(postData);
    } catch (error) {
        ng(error);
    }
});

const updateBookList = (db: pkg.Database, putData: BookListType) => new Promise<BookListType|Error>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE book_lists SET dataType = ?, seriesId = ?, year = ?, issue = ?, title = ?, authors = ?, publisher = ?, url = ?, description = ? WHERE id = ?",
            [ putData.dataType, putData.seriesId, putData.year, putData.issue, putData.title, putData.authors, putData.publisher, putData.url, putData.description, putData.id ]
        );
        ok(putData);    
    } catch (error) {
        ng(error);
    }
});

export const POST: RequestHandler = async ({ request }) => {
	const postData : BookListType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendBookList(db, postData);
        return json(result)
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const putData : BookListType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updateBookList(db, putData);
        return json(result)
    } finally {
        db.close();
    }
};