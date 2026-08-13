import type { PageServerLoad } from './$types';
import type { PersonType } from '../../../types/person';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PersonsModel from '../../../models/persons';


export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);    
    try {
        const id = Number(params.id);
		return {
			person: await PersonsModel.get(db, id),
            works: await PersonsModel.getRelatedWorks(db, id),
            prints: await PersonsModel.getRelatedPrints(db, id),
            movies: await PersonsModel.getRelatedMovies(db, id)
		};
    } catch (e: unknown) {
		console.log(e);
		error(500, { message: 'Database Error' });
	} finally {
        db.close();
    }
};