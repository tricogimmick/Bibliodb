import pkg from 'sqlite3';
import type { SeriesType, RelatedSeriesType } from '../types/series';
import * as PublisherModel from './publishers';

// シリーズを取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<SeriesType>((resolve, reject) => {
        db.get<SeriesType>('SELECT * FROM series WHERE id = ?', [id], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row?.publisherId) {
                    row.publisher = await PublisherModel.get(db, row.publisherId);
                }
                resolve(row);
            }
        });
    });
}

// 全てのシリーズを取得する
export function getAll(db: pkg.Database) {
    return new Promise<SeriesType[]>((resolve, reject) => {
        db.all<SeriesType>('SELECT * FROM series ORDER BY [index], id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// シリーズを更新する
export async function update(db: pkg.Database, series: SeriesType) {
    // 出版社IDがnullで、出版社名が存在する場合は、出版社を登録する
    if (series.publisherId === null && series.publisher?.name) {
        const publisher = await PublisherModel.update(db, series.publisher);
        series.publisherId = publisher.id;
    }
    const [sql, params] = series.id === null
        ? ['INSERT INTO series ([index], title, originalTitle, seriesType, publisherId, description, bookReviewTarget) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [series.index, series.title, series.originalTitle, series.seriesType, series.publisherId, series.description, series.bookReviewTarget]]
        : ['UPDATE series SET [index] = ?, title = ?, originalTitle = ?, seriesType = ?, publisherId = ?, description = ?, bookReviewTarget = ? WHERE id = ?', 
            [series.index, series.title, series.originalTitle, series.seriesType, series.publisherId, series.description, series.bookReviewTarget, series.id]];
    return new Promise<SeriesType>((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                if (series.id === null) {
                    series.id = this.lastID;
                }
                resolve(series);
            }
        });
    });
}
