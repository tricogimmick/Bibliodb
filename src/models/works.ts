import type { WorkType } from '../types/work';
import type { RelatedPersonType } from '../types/relatedPerson';
import type { RelatedSeriesType } from '../types/relatedSeries';

import pkg from 'sqlite3';
import * as PersonsModel from './persons';
import * as SeriesModel from './series';
import * as RelatedPersonsModel from './relatedPersons';
import * as RelatedSeriesModel from './relatedSeries';
import * as RelatedLinksModel from './relatedLinks';
import * as RelatesTagsMpdel from './relatedTags';

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

// 作品を更新する
export async function update(db: pkg.Database, work: WorkType) {
    const [sql, params] = work.id === null
        ? ['INSERT INTO works ([index], title, variantTitles, originalTitle, contentType, synopsis, description, note, ' +
            'publicationYear, publicationEndYear, seqNo, finishedReading, status) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [work.index, work.title, work.variantTitles, work.originalTitle, work.contentType, work.synopsis, work.description, 
             work.note, work.publicationYear, work.publicationEndYear, work.seqNo, work.finishedReading, work.status]]
        : ['UPDATE works SET [index] = ?, title = ?, variantTitles = ?, originalTitle = ?, contentType = ?, synopsis = ?, description = ?, note = ?, ' +
            'publicationYear = ?, publicationEndYear = ?, seqNo = ?, finishedReading = ?, status = ? WHERE id = ?',
            [work.index, work.title, work.variantTitles, work.originalTitle, work.contentType, work.synopsis, work.description, 
             work.note, work.publicationYear, work.publicationEndYear, work.seqNo, work.finishedReading, work.status, work.id]]
    return new Promise<WorkType>((resolve, reject) => {
        db.run(sql, params, async function (err) {
            if (err) {
                reject(err);
            } else {
                if (work.id === null) {
                    work.id = this.lastID;
                } else {
                    if (work.relatedPersons != null && work.relatedPersons.length > 0) {
                        for (const relatedPerson of work.relatedPersons) {
                            await RelatedPersonsModel.add(db, 'WORK', work.id, relatedPerson);
                        }
                    }
                    if (work.relatedSeries != null && work.relatedSeries.length > 0) {
                        for (const relatesSeries of work.relatedSeries) {
                            await RelatedSeriesModel.add(db, 'WORK', work.id, relatesSeries);
                        }
                    }
                    if (work.relatedLinks != null && work.relatedLinks.length > 0) {
                        for (const relatedLink of work.relatedLinks) {
                            await RelatedLinksModel.add(db, 'WORK', work.id, relatedLink);
                        }
                    }
                    if (work.tags != null && work.tags.length > 0) {
                        for (const tag of work.tags) {
                            await RelatesTagsMpdel.add(db, tag);
                        }
                    }
                }
                resolve(work);
            }
        });
    });
}
