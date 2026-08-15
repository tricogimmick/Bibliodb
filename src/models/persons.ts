import type { PersonType } from '../types/person';
import type { WorkListViewItemType } from '../types/work'
import type { PrintListViewItemType } from '../types/print';
import type { MovieListViewItemType } from '../types/movie';

import pkg from 'sqlite3';
import * as RelatedLinksModel from './relatedLinks';

// 人物を取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<PersonType>(async (resolve, reject) => {
        db.get<PersonType>('SELECT * FROM persons WHERE id = ?', [id], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row.id) {
                    row.relatedLinks = await RelatedLinksModel.getAll(db, 'PERSON', row.id);
                }
                resolve(row);
            }
        });
    });
}

// 全てのシリーズを取得する
export function getAll(db: pkg.Database) {
    return new Promise<PersonType[]>((resolve, reject) => {
        db.all<PersonType>('SELECT * FROM persons ORDER BY [index], id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 関連作品を取得する
export async function getRelatedWorks(db: pkg.Database, id: number) {
    return new Promise<WorkListViewItemType[]>((resolve, reject) => {
        db.all<WorkListViewItemType>(
            "SELECT wk.id, wk.title, wk.publicationYear, wk.contentType " +
            "FROM related_persons as rp " +
            "JOIN works as wk ON wk.id = rp.relatedId " +
            "WHERE rp.relatedType = 'WORK' and rp.personId = ? " +
            "ORDER BY wk.publicationYear, wk.seqNo",
            [id],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// 関連出版物を取得する
export async function getRelatedPrints(db: pkg.Database, id: number) {
    return new Promise<PrintListViewItemType[]>((resolve, reject) => {
        db.all<PrintListViewItemType>(
            "SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.printType, bk.ownedType, bk.issueNumber " +
            "FROM related_persons as rp " +
            "JOIN prints as bk on bk.id = rp.relatedId " +
            "LEFT JOIN series as sr on sr.id = bk.seriesId " +
            "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
            "LEFT JOIN brands as br ON br.id = bk.brandId " +
            "WHERE rp.relatedType = 'PRINT' and  rp.personId = ? " +
            "ORDER BY bk.publicationDate",
            [id],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// 関連映画を取得する
export async function getRelatedMovies(db: pkg.Database, id: number) {
    return new Promise<MovieListViewItemType[]>((resolve, reject) => {
        db.all<MovieListViewItemType>(
            "SELECT DISTINCT m.id, m.title, m.country, m.releaseYear " +
            "FROM related_persons as rp " +
            "JOIN movies as m ON m.id = rp.relatedId " +
            "WHERE rp.relatedType = 'MOVIE' and rp.personId = ?  " +
            "ORDER BY m.releaseYear, m.title",
            [id],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// 人物を更新する
export async function update(db: pkg.Database, person: PersonType) {
    const [sql, params] = person.id === null
        ? ['INSERT INTO persons ([index], name, kana, born, died, description) VALUES (?, ?, ?, ?, ?, ?)', 
            [person.index, person.name, person.kana, person.born, person.died, person.description]]
        : ['UPDATE persons SET [index] = ?, name = ?, kana = ?, born = ?, died = ?, description = ? WHERE id = ?', 
            [person.index, person.name, person.kana, person.born, person.died, person.description, person.id]];
    return new Promise<PersonType>((resolve, reject) => {
        db.run(sql, params, async function (err) {
            if (err) {
                reject(err);
            } else {
                if (person.id === null) {
                    person.id = this.lastID;
                } else {
                    await RelatedLinksModel.deleteAll(db, 'PERSON', person.id);
                }
                if (person.relatedLinks != null && person.relatedLinks.length > 0) {
                    for (const relatedLink of person.relatedLinks) {
                        await RelatedLinksModel.add(db, 'PERSON', person.id, relatedLink);
                    }
                }
                resolve(person);
            }
        });
    });
}
