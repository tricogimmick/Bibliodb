import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as MoviesModel from '../../../models/movies';


export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env['BIBLIODB_PATH'] ?? '';
    const db = new pkg.Database(dbPath);    
    try {
        const movieId = Number(params.id);
		return {
			movie: await MoviesModel.get(db, movieId)
		};
    } catch (e) {
		console.log(e);
		error(500, 'Database Error');
	} finally {
        db.close();
    }
};