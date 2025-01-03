import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../../types/person';
import type { SeriesType } from '../../../../types/series';
import type { WorkType } from '../../../../types/work';
import type { RelatedPeronsType } from '../../../../types/relatedPersons';
import type { RelatedLinksType } from '../../../../types/relatedLinks';
import type { RelatedSeriesType } from '../../../../types/relatedSeries';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getWork, getAllRelatedPersons, getAllRelatedLinks, getAllRelatedSeries, getAllPersons, getAllSeries, getAllRelatedTags } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new Database(dbPath);    
  try {
    return {
      work: await getWork(db, Number(params.id)) as WorkType,
      relatedPersons: await getAllRelatedPersons(db, "WORK", Number(params.id)) as RelatedPeronsType[],
      relatedLinks: await getAllRelatedLinks(db, "WORK", Number(params.id)) as RelatedLinksType[], 
      relatedSeries: await getAllRelatedSeries(db, "WORK", Number(params.id)) as RelatedSeriesType[],
      tags: await getAllRelatedTags(db, "WORK", Number(params.id)) as string[],
      persons: await getAllPersons(db) as PersonType[],
      series: await getAllSeries(db) as SeriesType[]
    };
  } catch (e) {
    console.log(e);
    error(500, 'Database Error');
  } finally {
      db.close();
  }
};