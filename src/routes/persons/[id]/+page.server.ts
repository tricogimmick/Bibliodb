import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getRow, getAllRows } from '$lib/common';

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

type PersonDisplayType = {
    id: number;
    index: string;
    name: string;
    kana: string;
    born: string;
    died: string;
    description: string;
    works: WorkDisplayType[];
    prints: PrintDisplayType[];
}

const getWorksSql = "SELECT wk.id, wk.title, wk.publicationYear, wk.contentType " +
                    "FROM related_persons as rp " +
                    "JOIN works as wk ON wk.id = rp.relatedId " +
                    "WHERE rp.relatedType = 'WORK' and rp.personId = ? " +
                    "ORDER BY wk.publicationYear, wk.seqNo"

const getPrintsSql = "SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.printType " +
                    "FROM related_persons as rp " +
                    "JOIN prints as bk on bk.id = rp.relatedId " +
                    "LEFT JOIN series as sr on sr.id = bk.seriesId " +
                    "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
                    "LEFT JOIN brands as br ON br.id = bk.brandId " +
                    "WHERE rp.personId = ? " +
                    "ORDER BY bk.publicationDate";

const getPerson = async (db: pkg.Database, personId: number) => {
    const person: PersonType = await getRow(db, "SELECT * FROM persons WHERE id = ?", [personId]);
    const works: WorkDisplayType[] = await getAllRows(db, getWorksSql, [personId]);
    const prints: PrintDisplayType[] = await getAllRows(db, getPrintsSql, [personId]);
    const result: PersonDisplayType = {
        id:  person.id as number,
        index: person.index,
        name: person.name,
        kana: person.kana,
        born: person.born,
        died: person.died,
        description: person.description,
        works,
        prints
    }
    return result;
}

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
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