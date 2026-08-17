import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as WorksModel from '../../../../models/works'
import * as PersonsModel from '../../../../models/persons';
import * as SeriesModel from '../../../../models/series';

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new pkg.Database(dbPath);    
  try {
    const workId = Number(params.id);
    return {
      work: await WorksModel.get(db, workId),
      persons: await PersonsModel.getAll(db),
      series: await SeriesModel.getAll(db)
    };
  } catch (e) {
    console.log(e);
    error(500, 'Database Error');
  } finally {
      db.close();
  }
};