import type { PageServerLoad } from './$types';
import type { WorkType } from '../../../types/work';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getRow, getAllRows } from '$lib/common';

type RelatedPersonDisplayType = {
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

type RelatedSeriesDisplayType = {
    seriesId: number;
    seriesTitle: string;
    description: string;
};

type PrintDisplayType = {
    id: number;
    series: string;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    printType: string;
}

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
    relatedPersons: RelatedPersonDisplayType[],
    relatedLinks: RelationLinkDisplayType[],
    relatedSeries: RelatedSeriesDisplayType[],
    prints: PrintDisplayType[]
}

// 作品情報を生成する
const createWorkDetail = (work: WorkType, relatedPersons: RelatedPersonDisplayType[], relatedLinks: RelationLinkDisplayType[], 
                          relatedSeries: RelatedSeriesDisplayType[], prints: PrintDisplayType[]) => ({
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
        relatedSeries,
        prints
});

// 作品を取得する
const getWork = (db: pkg.Database, id: number) => new Promise<WorkDetailType|Error>(async (ok, ng) => {
    try {
        const work: WorkType = await getRow(db, "SELECT * FROM works WHERE id = ?", [id]);
        const relatedPersons: RelatedPersonDisplayType[] = await getAllRows(db,
            "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
            "FROM related_persons as r " +
            "JOIN persons as p ON p.id = r.personId " +
            "WHERE r.relatedType = 'WORK' AND r.relatedId = ?", 
            [work.id]
        );
        const relatedLinks: RelationLinkDisplayType[] = await getAllRows<RelationLinkDisplayType>(db,
            "SELECT r.linkType, r.url, r.alt, r.description " +
            "FROM related_links as r " +
            "WHERE r.relatedType = 'WORK' AND  r.relatedId = ?", 
            [work.id]
        );
        const relatedSeries: RelatedSeriesDisplayType[] = await getAllRows(db,
            "SELECT r.seriesId, s.title as seriesTitle, r.description " +
            "FROM related_series as r " +
            "JOIN series as s ON s.id = r.seriesId " +
            "WHERE r.relatedType = 'WORK' AND r.relatedId = ?", 
            [work.id]
        );
        const prints: PrintDisplayType[] = await getAllRows(db,
            "SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.printType " +
            "FROM contents as ct " +
            "JOIN prints as bk on bk.id = ct.printId " +
            "LEFT JOIN series as sr on sr.id = bk.seriesId " +
            "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
            "LEFT JOIN brands as br ON br.id = bk.brandId " +
            "WHERE pw.workId = ? " +
            "ORDER BY bk.publicationDate",
            [work.id]
        );
        ok(createWorkDetail(work, relatedPersons, relatedLinks, relatedSeries, prints));
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