import type { PageServerLoad } from '../$types';
import type { MovieType } from '../../../../types/movie';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as MoviesModel from '../../../../models/movies';
import * as SeriesModels from '../../../../models/series';
import * as PersonsModel from '../../../../models/persons'

export const load: PageServerLoad = async ({ params }) => {
  const dbPath = env["BIBLIODB_PATH"] ?? "";
  const db = new pkg.Database(dbPath);
  try {
    const movieId = Number(params.id);
    return {
      movie: await MoviesModel.get(db, movieId),
      series: await SeriesModels.getAll(db),
      persons: await PersonsModel.getAll(db),
    };
  } catch (e) {
    error(500, { message: 'Database Error' });
  } finally {
    db.close();
  }
};