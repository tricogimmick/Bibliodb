import type { WorkType } from '../types/work';

import pkg from 'sqlite3';
import * as PersonsModel from './persons';
import * as SeriesModel from './series';
import * as RelatedLinksModel from './relatedLinks';
import * as TagsModel from './tags'

// 全ての作品を取得する
export function getAll(db: pkg.Database) {
    return new Promise<WorkType[]>((resolve, reject) => {
        db.all<WorkType>('SELECT * FROM works ORDER BY [index], id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 作品を取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<WorkType>(async (resolve, reject) => {
        db.get<WorkType>('SELECT * FROM works WHERE id = ?', [id], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row.id) {
                    row.relatedPersons = await PersonsModel.getRelatedPrsons(db, 'WORK', row.id);
                    row.relatedSeries = await SeriesModel.getRelatedSeries(db, 'WORK', row.id);
                    row.relatedLinks = await RelatedLinksModel.getAll(db, 'WORK', row.id);
                    row.tags = await TagsModel.getRelatedTags(db, 'WORK', row.id);
                }
                resolve(row);
            }
        });
    });
}