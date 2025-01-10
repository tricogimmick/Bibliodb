import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getRow, getAllRows } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;


type QueryResultType = {
    id: number | null;
    title: string;
    originalTitle: string;
    seriesId: number | null;
    seriesName: string;
    country: string;
    releaseYear: string;
    description: string;
    note: string;
    viewingDate: string;
    viewingMethod: string;
}

export type RelatedPersonDisplayType = {
    orderNo: number;
    personId: number;
    personName: string;
    role: string;
    description: string;
};

type RelationLinkDisplayType = {
    linkType: "IMG" | "LINK";
    url: string;
    alt: string;
    description: string;
};

type MovieDisplayType = {
    id: number | null;
    title: string;
    originalTitle: string;
    seriesId: number | null;
    seriesName: string;
    country: string;
    releaseYear: string;
    description: string;
    note: string;
    viewingDate: string;
    viewingMethod: string;
    relatedPersons: RelatedPersonDisplayType[];
    relatedLinks: RelationLinkDisplayType[];
};

// 映画を取得する
const getMovie = (db: pkg.Database, id: number) => new Promise<MovieDisplayType|Error>(async (ok, ng) => {
    try {
        const row = await getRow<QueryResultType>(db,
            "SELECT m.id, m.title, m.originalTitle, m.seriesId, s.title as seriesName, m.country, m.releaseYear, " +
            "m.description, m.note, m.viewingDate, m.viewingMethod FROM movies as m " +
            "LEFT JOIN series as s ON s.id = m.seriesId WHERE m.id = ?", 
            [id]
        );
        const relatedPersons = await getAllRows<RelatedPersonDisplayType>(db,
            "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
            "FROM related_persons as r " +
            "JOIN persons as p ON p.id = r.personId " +
            "WHERE r.relatedType = 'MOVIE' AND  r.relatedId = ?", [row.id]
        );
        const relatedLinks = await getAllRows<RelationLinkDisplayType>(db,
            "SELECT r.linkType, r.url, r.alt, r.description " +
            "FROM related_links as r " +
            "WHERE r.relatedType = 'MOVIE' AND  r.relatedId = ?", [row.id]
        );
        const movie: MovieDisplayType = {
            id: row.id,
            title: row.title,
            originalTitle: row.originalTitle,
            seriesId: row.seriesId,
            seriesName: row.seriesName,
            country: row.country,
            releaseYear: row.releaseYear,
            description: row.description,
            note: row.note,
            viewingDate: row.viewingDate,
            viewingMethod: row.viewingMethod,
            relatedPersons,
            relatedLinks,
        };
        ok(movie);
    } catch (error) {
        ng(error);
    }
});

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
			movie: await getMovie(db, Number(params.id)) as MovieDisplayType
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};