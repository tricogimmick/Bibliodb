import type { PageServerLoad } from './$types';
import type { WorkType } from '../../../types/work';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

type RelatedPersonDetailType = {
    orderNo: number;
    personId: number;
    personName: string;
    role: string;
    description: string;
};

type WorkDetailType = {
    id: number | null;
    title: string;
    originalTitle: string;
    contentType: string;
    description: string;
    url: string;
    note: string;
    publicationYear: number | null;
    seqNo: number | null;
    relatedPersons: RelatedPersonDetailType[]
}

// 作品を取得する
const getWork = (db: pkg.Database, id: number) => new Promise<WorkDetailType|Error>((ok, ng) => {
    db.serialize(() => {
        db.get<WorkType>("SELECT * FROM works WHERE id = ?", [id], (err, row) => {
            if (err) {
                ng(err);
            } else {
                db.all<RelatedPersonDetailType>(
                    "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
                    "FROM related_persons as r " +
                    "JOIN persons as p ON p.id = r.personId " +
                    "WHERE r.relatedType = 'WORK' AND r.relatedId = ?", [row.id], (err2, rows) => {
                        if (err2) {
                            ng(err);
                        } else {
                            const work: WorkDetailType = {
                                id: row.id,
                                title: row.title,
                                originalTitle: row.originalTitle,
                                contentType: row.contentType,
                                description: row.description,
                                url: row.url,
                                note: row.note,
                                publicationYear: row.publicationYear,
                                seqNo: row.seqNo,
                                relatedPersons: rows
                            };
                            ok(work);
                        }
                    });
            }
        });    
    })
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