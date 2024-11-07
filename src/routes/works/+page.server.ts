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

type WorkListType = {
	id: number | null;
    title: string;
	relatedPersons: {
		name: string;
	}[]
};

const getWorks = () => {
	const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
	return new Promise<WorkListType[]|Error>((ok, ng) => {
		let err = null;
		db.serialize(() => {
			db.all<QueryResultType>(
				"SELECT w.id, w.title, p.name as relatedPersonName FROM works as w " +
			    "LEFT JOIN related_persons as r ON r.relatedType = 'WORK' AND r.relatedId = w.id " + 
			    "LEFT JOIN persons as p ON p.id = r.personId ORDER BY w.id, r.orderNo",
				(err, rows) => {
					if (err) {
						ng()
					} else {
						const works: WorkListType[] = [];
						rows.forEach(r => {
							const work = works.find(x => x.id === r.id);
							if (work) {
								work.relatedPersons.push({ name: r.relatedPersonName });
							} else {
								works.push({
									id: r.id,
									title: r.title,
									relatedPersons: [ { name: r.relatedPersonName }]
								})
							}
						})
						ok(works);
					}
				});
		});
	});
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			works: await getWorks()
		};
	} catch (e) {
		console.log(e);
		error(500, { message: 'Database Error' });
	}
};