import type { PageServerLoad } from './$types';
import type { WorkType } from '../../../types/work';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getRow, getAllRows } from '$lib/common';

type RelatedPersonDetailType = {
    orderNo: number;
    personId: number;
    personName: string;
    role: string;
    description: string;
};

type RelationLinkDetailType = {
    linkType: "IMG" | "LINK";
    url: string;
    alt: string;
    description: string;
};

type RelatedSeriesDetailType = {
    seriesId: number;
    seriesTitle: string;
    description: string;
};


type WorkDetailType = {
    id: number | null;
    index: string;
    title: string;
    variantTitles: string;
    originalTitle: string;
    contentType: string;
    description: string;
    note: string;
    publicationYear: number | null;
    seqNo: number | null;
    finishedReading: string;
    relatedPersons: RelatedPersonDetailType[],
    relatedLinks: RelationLinkDetailType[],
    relatedSeries: RelatedSeriesDetailType[]
}

// 作品情報を生成する
const createWorkDetail = (work: WorkType, relatedPersons: RelatedPersonDetailType[], relatedLinks: RelationLinkDetailType[], relatedSeries: RelatedSeriesDetailType[]) => ({
        id: work.id,
        index: work.index,
        title: work.title,
        variantTitles: work.variantTitles,
        originalTitle: work.originalTitle,
        contentType: work.contentType,
        description: work.description,
        note: work.note,
        publicationYear: work.publicationYear,
        seqNo: work.seqNo,
        finishedReading: work.finishedReading,
        relatedPersons,
        relatedLinks,
        relatedSeries
});

// 作品を取得する
const getWork = (db: pkg.Database, id: number) => new Promise<WorkDetailType|Error>(async (ok, ng) => {
    try {
        const work: WorkType = await getRow(db, "SELECT * FROM works WHERE id = ?", [id]);
        const relatedPersons: RelatedPersonDetailType[] = await getAllRows(db,
            "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
            "FROM related_persons as r " +
            "JOIN persons as p ON p.id = r.personId " +
            "WHERE r.relatedType = 'WORK' AND r.relatedId = ?", 
            [work.id]
        );
        const relatedLinks: RelationLinkDetailType[] = await getAllRows<RelationLinkDetailType>(db,
            "SELECT r.linkType, r.url, r.alt, r.description " +
            "FROM related_links as r " +
            "WHERE r.relatedType = 'WORK' AND  r.relatedId = ?", 
            [work.id]
        );
        const relatedSeries: RelatedSeriesDetailType[] = await getAllRows(db,
            "SELECT r.seriesId, s.title as seriesTitle, r.description " +
            "FROM related_series as r " +
            "JOIN series as s ON s.id = r.seriesId " +
            "WHERE r.relatedType = 'WORK' AND r.relatedId = ?", 
            [work.id]
        );
        ok(createWorkDetail(work, relatedPersons, relatedLinks, relatedSeries));
    } catch (e: any) {
        ng(e);
    }
});

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
			work: await getWork(db, Number(params.id)) as WorkDetailType
		};
    } catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};