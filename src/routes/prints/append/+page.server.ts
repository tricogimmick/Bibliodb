import type { PageServerLoad } from '../$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import { createPrintType } from '../../../types/print';
import * as PublishersModel from '../../../models/publishers'
import * as BrandsModel from '../../../models/brands';
import * as SeriesModel from '../../../models/series';
import * as PersonsModel from '../../../models/persons';
import * as WorksModel from '../../../models/works';
import * as RelatedPersonsModel from '../../../models/relatedPersons';


export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new pkg.Database(dbPath);    
  try {
    return {
      print: createPrintType(),
      publishers: await PublishersModel.getAll(db),
      brands: await BrandsModel.getAll(db),
      series: await SeriesModel.getAll(db),
      persons: await PersonsModel.getAll(db),
      works: await WorksModel.getAll(db),
      worksRelatedPersons: await RelatedPersonsModel.getAllReatedPersons(db, 'WORK')
    };
  } catch (e) {
    error(500, { message: 'Database Error' });
  } finally {
    db.close();
  }
};