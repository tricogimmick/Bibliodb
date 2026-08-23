import type { PageServerLoad } from '../$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as SeriesModels from '../../../models/series';
import { createCollectionType } from '../../../types/collection';


export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env['BIBLIODB_PATH'] ?? '';
  const db = new pkg.Database(dbPath);    
  try {
    return {
      collection: createCollectionType(),
      series: await SeriesModels.getAll(db)
    };
  } catch (e) {
    error(500, { message: 'Database Error' });
  } finally {
    db.close();
  }
};