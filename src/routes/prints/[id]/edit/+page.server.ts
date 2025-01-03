import type { PageServerLoad } from '../$types';
import type { PrintType } from '../../../../types/print';
import type { ContentType } from '../../../../types/content';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';
import type { RelatedLinksType } from '../../../../types/relatedLinks';
import type { PublisherType } from '../../../../types/publisher';
import type { BrandType } from '../../../../types/brand';
import type { SeriesType } from '../../../../types/series';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getPrint, getContents, getAllRelatedPersons, getAllRelatedLinks, getAllRelatedWorks, 
         getAllPublishers, getAllBrands, getAllSeries, getAllPersons, getAllWorks } from '$lib/common';
import type { RelatedWorksType } from '../../../../types/relatedWorks';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);    
    try {
		return {
      print: await getPrint(db, Number(params.id)) as PrintType,
      contents: await getContents(db, Number(params.id)) as ContentType[],
      relatedPersons: await getAllRelatedPersons(db, "PRINT", Number(params.id)) as RelatedPeronsType[],
      relatedLinks: await getAllRelatedLinks(db, "PRINT", Number(params.id)) as RelatedLinksType[],
      relatedWorks: await getAllRelatedWorks(db, "PRINT", "COVER", Number(params.id)) as RelatedWorksType[],
      publishers: await getAllPublishers(db) as PublisherType[],
      brands: await getAllBrands(db) as BrandType[],
      series: await getAllSeries(db) as SeriesType[],
      persons: await getAllPersons(db) as PersonType[],
      works: await getAllWorks(db) as WorkType[],
      worksRelatedPersons: await getAllRelatedPersons(db, "WORK", null) as RelatedPeronsType[]  
		};
    } catch (e) {
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};