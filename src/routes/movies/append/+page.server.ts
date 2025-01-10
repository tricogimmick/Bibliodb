import type { PageServerLoad } from '../$types';
import type { RelatedPeronsType } from '../../../types/relatedPersons';
import type { SeriesType } from '../../../types/series';
import type { PersonType } from '../../../types/person';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllRelatedPersons, getAllSeries, getAllPersons } from '$lib/common';

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new Database(dbPath);    
  try {
    return {
      series: await getAllSeries(db) as SeriesType[],
      persons: await getAllPersons(db) as PersonType[],
    };
  } catch (e) {
    error(500, { message: 'Database Error' });
  } finally {
    db.close();
  }
};