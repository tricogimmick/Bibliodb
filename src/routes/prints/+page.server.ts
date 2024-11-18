import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

type QueryResultType = {
	id: number | null;
	seriesId: number | null;
	seriesName: string;
    title: string;
	relatedPersonName: string;
}

type PrintListType = {
	id: number | null;
	seriesId: number | null;
	seriesName: string;
    title: string;
	relatedPersons: {
		name: string;
	}[]
};

const getPrints = (db: pkg.Database) => new Promise<PrintListType[]|Error>((ok, ng) => {
	db.all<QueryResultType>(
		"SELECT p.id, p.seriesId, s.title as seriesName, p.title, a.name as relatedPersonName FROM prints as p " +
		"LEFT JOIN series as s on s.id = p.seriesId " + 
		"LEFT JOIN related_persons as r ON r.relatedType = 'PRINT' AND r.relatedId = p.id " + 
		"LEFT JOIN persons as a ON a.id = r.personId ORDER BY s.title, p.title",
		(err, rows) => {
			if (err) {
				ng()
			} else {
				const prints: PrintListType[] = [];
				rows.forEach(r => {
					const print = prints.find(x => x.id === r.id);
					if (print) {
						print.relatedPersons.push({ name: r.relatedPersonName });
					} else {
						if (r.relatedPersonName != null) {
							prints.push({
								id: r.id,
								seriesId: r.seriesId,
								seriesName: r.seriesName,
								title: r.title,
								relatedPersons: [ { name: r.relatedPersonName }]
							})
						} else {
							prints.push({
								id: r.id,
								seriesId: r.seriesId,
								seriesName: r.seriesName,
								title: r.title,
								relatedPersons: []
							})
						}
					}
				})
				ok(prints);
			}
		});
});

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			prints: await getPrints(db)
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
		db.close();
	}
};