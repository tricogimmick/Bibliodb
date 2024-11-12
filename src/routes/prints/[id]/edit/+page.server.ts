import type { PageServerLoad } from '../$types';
import type { PublisherType } from '../../../../types/publisher';
import type { BrandType } from '../../../../types/brand';
import type { SeriesType } from '../../../../types/series';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';
import type { PrintType } from '../../../../types/print';
import type { PrintsWorksType } from '../../../../types/printsWorks';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';
import type { RelatedLinksType } from '../../../../types/relatedLinks';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllPublishers, getAllBrands, getAllSeries, getAllPersons, getPrint, getPrintWorks, getAllRelatedPersons, getAllRelatedLinks, getAllWorks } from '$lib/common';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
            publishers: await getAllPublishers(db) as PublisherType[],
            brands: await getAllBrands(db) as BrandType[],
            series: await getAllSeries(db) as SeriesType[],
			      persons: await getAllPersons(db) as PersonType[],
            works: await getAllWorks(db) as WorkType[],
            print: await getPrint(db, Number(params.id)) as PrintType,
            printWorks: await getPrintWorks(db, Number(params.id)) as PrintsWorksType[],
            relatedPersons: await getAllRelatedPersons(db, "PRINT", Number(params.id)) as RelatedPeronsType[],
            relatedLinks: await getAllRelatedLinks(db, "PRINT", Number(params.id)) as RelatedLinksType[]
		};
    } catch (e) {
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};