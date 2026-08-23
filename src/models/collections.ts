import type { CollectionType } from '../types/collection'

import pkg from 'sqlite3';
import * as SeriesModel from './series';

// コレクションを取得する
export function get(db: pkg.Database, collectionId: number) {
    return new Promise<CollectionType>((resolve, reject) => {
        db.get<CollectionType>('SELECT * FROM collections WHERE id = ?', [collectionId], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row?.seriesId) {
                    row.series = await SeriesModel.get(db, row.seriesId);
                }
                resolve(row);
            }
        });
    });
}

// 全ての映画を取得する
export function getAll(db: pkg.Database) {
    return new Promise<CollectionType[]>((resolve, reject) => {
        db.all<CollectionType>('SELECT * FROM collections ORDER BY title', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// コレクションを更新する
export async function update(db: pkg.Database, collection: CollectionType) {
    if (collection.seriesId === null && collection.series != null && collection.series.index != '') {
        const series = await SeriesModel.update(db, collection.series);
        collection.seriesId = series.id;
    }
    const [sql, params] = collection.id === null
        ? ['INSERT INTO collections (title, seriesId, issue, collectionType, description, note) VALUES (?, ?, ?, ?, ?, ?)',
            [collection.title, collection.seriesId, collection.issue, collection.collectionType, collection.description, collection.note]]
        : ['UPDATE collections SET title = ?, seriesId = ?, issue = ?, collectionType = ?, description = ?, note = ? WHERE id = ?',
            [collection.title, collection.seriesId, collection.issue, collection.collectionType, collection.description, collection.note, collection.id]];
    return new Promise<CollectionType>((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                if (collection.id === null) {
                    collection.id = this.lastID;
                }
                resolve(collection);
            }
        });
    });
}

