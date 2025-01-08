import type { PageServerLoad } from './$types';
import type { PrintType } from '../../../types/print';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getRow, getAllRows } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;


type QueryResultType = {
    id: number | null;
    title: string;
    originalTitle: string;
    printType: string;
    publisherName: string;
    brandName: string;
    publicationDate: string;
    issueNumber: number | null;
    seriesId: number | null;
    seriesName: string;
    description: string;   
    toc: string;
    note: string;
    ownedType: string; 
}

type RelatedPersonDisplayType = {
    orderNo: number;
    personId: number;
    personName: string;
    role: string;
    description: string;
};

type RelatedWorksDisplayType = {
    subType: string,
    workId: number;
    title: string;
}

type RelationLinkDisplayType = {
    linkType: "IMG" | "LINK";
    url: string;
    alt: string;
    description: string;
};

type ContentQueryResultType = {
    orderNo: number;
    workId: number;
    title: string;
    subTitle: string;
    description: string;
    pageNo: number | null;
    color: number | null;
    publishType: string;
    relatedPersonId: number;
	relatedPersonName: string;
}

type ContentDisplayType = {
    orderNo: number;
    workId: number;
    title: string;
    subTitle: string;
    description: string;
    pageNo: number | null;
    color: number | null;
    publishType: string;
	relatedPersons: {
        id: number | null;
		name: string;
	}[]
}

type PrintDisplayType = {
    id: number | null;
    title: string;
    originalTitle: string;
    printType: string;
    publisherName: string;
    brandName: string;
    publicationDate: string;
    issueNumber: number | null;
    seriesId: number | null;
    seriesName: string;
    description: string;   
    toc: string;
    note: string;
    ownedType: string; 
    relatedPersons: RelatedPersonDisplayType[];
    relatedWorks: RelatedWorksDisplayType[];
    relatedLinks: RelationLinkDisplayType[];
    contents: ContentDisplayType[];
};

// 出版物を取得する
const getPrint = (db: pkg.Database, id: number) => new Promise<PrintDisplayType|Error>(async (ok, ng) => {
    try {
        const row = await getRow<QueryResultType>(db,
            "SELECT p.id, p.title, p.originalTitle, p.printType, c.name as publisherName, b.name as brandName, p.publicationDate, " +
            "p.issueNumber, p.seriesId, s.title as seriesName, p.description, p.toc, p.note, p.ownedType FROM prints as p " +
            "LEFT JOIN publishers as c ON c.id = p.publisherId " +
            "LEFT JOIN brands as b ON b.id = p.brandId " +
            "LEFT JOIN series as s ON s.id = p.seriesId WHERE p.id = ?", 
            [id]
        );
        const relatedPersons = await getAllRows<RelatedPersonDisplayType>(db,
            "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
            "FROM related_persons as r " +
            "JOIN persons as p ON p.id = r.personId " +
            "WHERE r.relatedType = 'PRINT' AND  r.relatedId = ?", [row.id]
        );
        const relatedWorks = await getAllRows<RelatedWorksDisplayType>(db,
            "SELECT rw.subType, rw.workId, wk.title " +
            "FROM related_works as rw JOIN works as wk on wk.id = rw.workId " +
            "WHERE rw.relatedType = 'PRINT' AND rw.relatedId = ?", [row.id]
        );
        const relatedLinks = await getAllRows<RelationLinkDisplayType>(db,
            "SELECT r.linkType, r.url, r.alt, r.description " +
            "FROM related_links as r " +
            "WHERE r.relatedType = 'PRINT' AND  r.relatedId = ?", [row.id]
        );
        const contentResults = await getAllRows<ContentQueryResultType>(db,
            "SELECT ct.orderNo, ct.workId, CASE WHEN ct.workId IS null THEN ct.title ELSE wk.title END as title, " +
            "ct.subTitle, ct.description, ct.pageNo, ct.color, ct.publishType, ps.id as relatedPersonId, ps.name as relatedPersonName " +
            "FROM contents as ct " +
            "LEFT JOIN works as wk ON wk.id = ct.workId " +
            "LEFT JOIN related_persons as rp ON rp.relatedType = 'WORK' AND rp.relatedId = wk.id " + 
            "LEFT JOIN persons as ps ON ps.id = rp.personId " +        
            "WHERE ct.printId = ? ORDER BY ct.orderNo", [row.id]
        );
        const contents: ContentDisplayType[] = [];
        contentResults.forEach(x => {
            const content = contents.find(c => c.orderNo === x.orderNo);
            if (content) {
                content.relatedPersons.push({ id: x.relatedPersonId, name: x.relatedPersonName });
            } else {
                contents.push({
                    orderNo: x.orderNo,
                    workId: x.workId,
                    title: x.title,
                    subTitle: x.subTitle,
                    description: x.description,
                    pageNo: x.pageNo,
                    color: x.color,
                    publishType: x.publishType,
                    relatedPersons: [{ id: x.relatedPersonId, name: x.relatedPersonName }]
                });
            }
        })

        const print: PrintDisplayType = {
            id: row.id,
            title: row.title,
            originalTitle: row.originalTitle,
            printType: row.printType,
            publisherName: row.publisherName,
            brandName: row.brandName,
            publicationDate: row.publicationDate,
            issueNumber: row.issueNumber,
            seriesId: row.seriesId,
            seriesName: row.seriesName,
            description: row.description, 
            toc: row.toc,
            note: row.note,
            ownedType: row.ownedType,                            
            relatedPersons,
            relatedWorks,
            relatedLinks,
            contents
        };
        ok(print);
    } catch (error) {
        ng(error);
    }
});

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
			print: await getPrint(db, Number(params.id)) as PrintDisplayType
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};