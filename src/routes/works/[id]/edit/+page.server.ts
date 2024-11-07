import type { PageServerLoad } from './[id]/$types';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';

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

// 関連人物を取得
const getRelatedPersons = (id: number, db: pkg.Database) => {
	return new Promise<RelatedPeronsType[]|Error>((ok, ng) => {
        db.all<RelatedPeronsType>("SELECT * FROM related_persons WHERE relatedType = 'WORK' AND relatedId = ?", [id], (err, rows) => {
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
            relatedPersons: await getRelatedPersons(Number(params.id), db) as RelatedPeronsType[]
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};