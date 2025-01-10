import type { RequestHandler } from './$types';
import type { MovieType } from '../../../types/movie';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { runSql } from '$lib/common';

export type PostDataType = {
    id: number | null; 
    title: string; 
    originalTitle: string; 
    seriesId: number | null; 
    country: string; 
    releaseYear: string; 
    description: string; 
    note: string; 
    viewingDate: string; 
    viewingMethod: string; 
    relatedPersons: {
        orderNo: number;
        personId: number;
        role: string;
        description: string;
    }[];
    relatedLinks: {
        linkType: "IMG" | "LINK";
        url: string;
        alt: string;
        description: string;
    }[];
};

const cretaeMovieData = (id: number, postData: PostDataType) => ({
    id,
    title: postData.title, 
    originalTitle: postData.originalTitle, 
    seriesId: postData.seriesId,
    country: postData.country,
    releaseYear: postData.releaseYear,
    description: postData.description,
    note: postData.note,
    viewingDate: postData.viewingDate, 
    viewingMethod: postData.viewingMethod
});

const appendMovie = (db: pkg.Database, postData: PostDataType) => new Promise<MovieType|Error>(async (ok, ng) => {
    try {
        const movieId = await runSql(db, 
            "INSERT INTO movies (title , originalTitle, seriesId, country, releaseYear, description, note, viewingDate, viewingMethod) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [ postData.title , postData.originalTitle, postData.seriesId, postData.country, postData.releaseYear, postData.description, 
              postData.note, postData.viewingDate, postData.viewingMethod ]);
        for (const relatedPerson of postData.relatedPersons) {
            await runSql(db, 
                "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["MOVIE", movieId, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description]);
        }
        for (const relatedLink of postData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["PRINT", movieId, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        ok(cretaeMovieData(movieId as number, postData));
    } catch (error) {
        ng(error);
    }
});

const updateMovie = (db: pkg.Database, putData: PostDataType) => new Promise<MovieType|Error>(async (ok, ng) => {
    try {
        await runSql(db,
            "UPDATE movies SET title = ? , originalTitle = ?, seriesId = ?, country = ?, releaseYear = ?, description = ?, " +
            "note = ?, viewingDate = ?, viewingMethod = ? WHERE id = ?",
            [ putData.title , putData.originalTitle, putData.seriesId, putData.country, putData.releaseYear, putData.description, 
              putData.note, putData.viewingDate, putData.viewingMethod, putData.id ]
        );
        await runSql(db, "DELETE FROM related_persons WHERE relatedType = 'MOVIE' AND relatedId = ?", [putData.id]);
        for (const author of putData.relatedPersons) {
            await runSql(db,
                    "INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)",
                    ["MOVIE", putData.id, author.orderNo, author.personId, author.role, author.description]);
        }    
        await runSql(db, "DELETE FROM related_links WHERE relatedType = 'MOVIE' AND relatedId = ?", [putData.id]);
        for (const relatedLink of putData.relatedLinks) {
            await runSql(db,
                "INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)",
                ["MOVIE", putData.id, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description]);
        }
        ok(cretaeMovieData(putData.id as number, putData));    
    } catch (error) {
        ng(error);
    }
});

export const POST: RequestHandler = async ({ request }) => {
	const postData : PostDataType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendMovie(db, postData);
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
        const result = await updateMovie(db, putData);
        return json(result)
    } finally {
        db.close();
    }
};