import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';
import type { RelatedLinksType } from '../../../../types/relatedLinks';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllPersons, getWork, getAllRelatedPersons, getAllRelatedLinks } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
            persons: await getAllPersons(db) as PersonType[],
      			work: await getWork(db, Number(params.id)) as WorkType,
            relatedPersons: await getAllRelatedPersons(db, "WORK", Number(params.id)) as RelatedPeronsType[],
            relatedLinks: await getAllRelatedLinks(db, "WORK", Number(params.id)) as RelatedLinksType[]
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};