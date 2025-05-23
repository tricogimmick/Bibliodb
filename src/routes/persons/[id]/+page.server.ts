import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getRow, getAllRows } from '$lib/common';

type RelationLinkDisplayType = {
    linkType: "IMG" | "LINK";
    url: string;
    alt: string;
    description: string;
};

type WorkDisplayType = {
    id: number;
    title: string;
    publicationYear: number;
    contentType: string;
}

type PrintDisplayType = {
    id: number;
    series: string;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    printType: string;
}

type MovieDisplayType = {
    id: number;
    title: string;
    country: string;
    releaseYear: string;
}

type PersonDisplayType = {
    id: number;
    index: string;
    name: string;
    kana: string;
    born: string;
    died: string;
    description: string;
    relatedLinks: RelationLinkDisplayType[];
    works: WorkDisplayType[];
    prints: PrintDisplayType[];
    movies: MovieDisplayType[];
}

const getPerson = async (db: pkg.Database, personId: number) => {
    const person: PersonType = await getRow(db, "SELECT * FROM persons WHERE id = ?", [personId]);
    const relatedLinks: RelationLinkDisplayType[] = await getAllRows<RelationLinkDisplayType>(db,
        "SELECT r.linkType, r.url, r.alt, r.description " +
        "FROM related_links as r " +
        "WHERE r.relatedType = 'PERSON' AND  r.relatedId = ?", 
        [personId]
    );
    const works: WorkDisplayType[] = await getAllRows(db, 
        "SELECT wk.id, wk.title, wk.publicationYear, wk.contentType " +
        "FROM related_persons as rp " +
        "JOIN works as wk ON wk.id = rp.relatedId " +
        "WHERE rp.relatedType = 'WORK' and rp.personId = ? " +
        "ORDER BY wk.publicationYear, wk.seqNo",
        [personId]
    );
    const prints: PrintDisplayType[] = await getAllRows(db, 
        "SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.printType " +
        "FROM related_persons as rp " +
        "JOIN prints as bk on bk.id = rp.relatedId " +
        "LEFT JOIN series as sr on sr.id = bk.seriesId " +
        "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
        "LEFT JOIN brands as br ON br.id = bk.brandId " +
        "WHERE rp.relatedType = 'PRINT' and  rp.personId = ? " +
        "ORDER BY bk.publicationDate", 
        [personId]
    );
    const movies: MovieDisplayType[] = await getAllRows(db,
        "SELECT DISTINCT m.id, m.title, m.country, m.releaseYear " +
        "FROM related_persons as rp " +
        "JOIN movies as m ON m.id = rp.relatedId " +
        "WHERE rp.relatedType = 'MOVIE' and rp.personId = ?  " +
        "ORDER BY m.releaseYear, m.title",
        [personId]
    );
    return {
        id:  person.id as number,
        index: person.index,
        name: person.name,
        kana: person.kana,
        born: person.born,
        died: person.died,
        description: person.description,
        relatedLinks,
        works,
        prints,
        movies
    } as PersonDisplayType;
}

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
			person: await getPerson(db, Number(params.id)) as PersonDisplayType
		};
    } catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};