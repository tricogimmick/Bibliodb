import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;
import { getRow, getAllRows } from '$lib/common';

type PrintDisplayType = {
    id: number;
    series: string;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    issueNumber: number | null;
    printType: string;
}

type SeriesDisplayType = {
    id: number|null;
    index: string;
    title: string;
    originalTitle: string;
    seriesType: string;
    publisherId: Number | null;
	publisherName: string;
    description: string;
	prints: PrintDisplayType[];
};

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		const seriesId = Number(params.id);
		const series: SeriesDisplayType = await getRow<SeriesDisplayType>(db, 
			"SELECT s.*, p.name as publisherName, null as prints FROM series as s LEFT JOIN publishers as p ON p.id = s.publisherId " +
			"WHERE s.id = ?",
			[ Number(params.id) ]
		);
        const prints: PrintDisplayType[] = await getAllRows<PrintDisplayType>(db,
            "SELECT bk.id, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.issueNumber, bk.printType " +
			"FROM prints as bk " +
            "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
            "LEFT JOIN brands as br ON br.id = bk.brandId " +
            "WHERE bk.seriesId = ? " +
            "ORDER BY bk.issueNumber, bk.publicationDate",
            [seriesId]
        );
		series.prints = prints;
		return {
			series
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};