import type { PageServerLoad } from '../$types';
import type { SeriesType } from '../../../types/series';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllSeries } from '$lib/common';

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new Database(dbPath);    
  try {
    return {
      series: await getAllSeries(db) as SeriesType[],
    };
  } catch (e) {
    error(500, { message: 'Database Error' });
  } finally {
    db.close();
  }
};