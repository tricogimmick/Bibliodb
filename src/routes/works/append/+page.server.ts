import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';
import type { SeriesType } from '../../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAllPersons, getAllSeries } from '$lib/common';
import pkg from 'sqlite3';
const {Database} = pkg;

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new Database(dbPath);    
  try {
    return {
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