import type { PageServerLoad } from '../$types';
import type { PublisherType } from '../../../../types/publisher';
import type { BrandType } from '../../../../types/brand';
import type { SeriesType } from '../../../../types/series';
import type { PersonType } from '../../../../types/person';
import type { PrintType } from '../../../../types/print';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';
import type { RelatedLinksType } from '../../../../types/relatedLinks';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllPublishers, getAllBrands, getAllSeries, getAllPersons, getPrint, getAllRelatedPersons, getAllRelatedLinks } from '$lib/common';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
        const relatedPersons = await getAllRelatedPersons(db, "PRINT", Number(params.id)) as RelatedPeronsType[];
        if (relatedPersons.length === 0) {
            relatedPersons.push({
                relatedType: "PRINT",
                relatedId: null,
                orderNo: 1,
                personId: null,
                role: "作者",
                description: ""            
            });
        }
		return {
            publishers: await getAllPublishers(db) as PublisherType[],
            brands: await getAllBrands(db) as BrandType[],
            series: await getAllSeries(db) as SeriesType[],
			persons: await getAllPersons(db) as PersonType[],
            print: await getPrint(db, Number(params.id)) as PrintType,
            relatedPersons: relatedPersons,
            relatedLinks: await getAllRelatedLinks(db, "PRINT", Number(params.id)) as RelatedLinksType[]
		};
    } catch (e) {
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};