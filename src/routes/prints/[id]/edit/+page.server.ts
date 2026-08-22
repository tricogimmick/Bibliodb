import type { PageServerLoad } from '../$types';
import type { PrintType } from '../../../../types/print';
import type { ContentType } from '../../../../types/content';
import type { PublisherType } from '../../../../types/publisher';
import type { BrandType } from '../../../../types/brand';
import type { SeriesType } from '../../../../types/series';
import type { PersonType } from '../../../../types/person';
import type { WorkType } from '../../../../types/work';
import type { RelatedPersonType } from '../../../../types/relatedPerson';
import type { RelatedLinkType } from '../../../../types/relatedLink';
import type { RelatedWorkType } from '../../../../types/relatedWork';

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
import * as PrintsModel from '../../../../models/prints';
import * as PublishersModel from '../../../../models/publishers'
import * as BrandsModel from '../../../../models/brands';
import * as SeriesModel from '../../../../models/series';
import * as PersonsModel from '../../../../models/persons';
import * as WorksModel from '../../../../models/works';
import * as RelatedPersonsModel from '../../../../models/relatedPersons';

export const load: PageServerLoad = async ({ params }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new pkg.Database(dbPath);    
    try {
      const porintId = Number(params.id);
      return {
          print: await PrintsModel.get(db, porintId),
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