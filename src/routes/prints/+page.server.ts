import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

type QueryResultType = {
	id: number | null;
    title: string;
	relatedPersonName: string;
}

type PrintListType = {
	id: number | null;
    title: string;
	relatedPersons: {
		name: string;
	}[]
};

const getPrints = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<PrintListType[]|Error>((ok, ng) => {
		let err = null;
		db.serialize(() => {
			db.all<QueryResultType>(
				"SELECT p.id, p.title, a.name as relatedPersonName FROM prints as p " +
			    "LEFT JOIN related_persons as r ON r.relatedType = 'PRINT' AND r.relatedId = p.id " + 
			    "LEFT JOIN persons as a ON a.id = r.personId ORDER BY p.id, r.orderNo",
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
								prints.push({
									id: r.id,
									title: r.title,
									relatedPersons: [ { name: r.relatedPersonName }]
								})
							}
						})
						ok(prints);
					}
				});
		});
	});
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			prints: await getPrints()
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	}
};