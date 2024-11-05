import type { PageServerLoad } from '../$types';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';
import type { WorksPeronsType } from '../../../../types/worksPersons';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

// 人物を取得
const getPersons = (db: pkg.Database) => {
	return new Promise<PersonType[]|Error>((ok, ng) => {
        db.all<PersonType>("SELECT * FROM persons ORDER BY nameIndex, id", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

// 作品を取得
const getWork = (id: number, db: pkg.Database) => {
	return new Promise<WorkType|Error>((ok, ng) => {
        db.get<WorkType>("SELECT * FROM works WHERE id = ?", [id], (err, row) => {
            if (err) {
                ng(err);
            } else {
                ok(row);
            }
        });
	})
};

// 著作者を取得
const getAuthors = (id: number, db: pkg.Database) => {
	return new Promise<WorksPeronsType[]|Error>((ok, ng) => {
        db.all<WorksPeronsType>("SELECT * FROM works_persons WHERE workId = ?", [id], (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
	})
};

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
            persons: await getPersons(db) as PersonType[],
			work: await getWork(Number(params.id), db) as WorkType,
            authors: await getAuthors(Number(params.id), db) as WorksPeronsType[]
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};