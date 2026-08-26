import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PersonsModel from '../../../models/persons';
import * as WorksModel from '../../../models/works';
import * as PrintsModel from '../../../models/prints';
import * as MoviesModel from '../../../models/movies'


export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);    
    try {
        const personId = Number(params.id);
		return {
			person: await PersonsModel.get(db, personId),
            works: await WorksModel.getRelatedWorksByPersonId(db, personId),
            books: await PrintsModel.getRelatedBookListByPersonId(db, personId),
            movies: await MoviesModel.getRelatedMoviesByPersonId(db, personId)
		};
    } catch (e: unknown) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};