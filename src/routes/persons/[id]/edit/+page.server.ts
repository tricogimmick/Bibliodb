import type { PageServerLoad } from '../$types';
import type { RelatedLinksType } from '../../../../types/relatedLinks';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getPerson, getAllRelatedLinks } from '$lib/common';
import pkg from 'sqlite3';
import type { PersonType } from '../../../../types/person';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
	const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
	try {
		return {
			person: await getPerson(db, Number(params.id)) as PersonType,
			relatedLinks: await getAllRelatedLinks(db, "PERSON", Number(params.id)) as RelatedLinksType[], 
		};
	} catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
		db.close();
	}
};

