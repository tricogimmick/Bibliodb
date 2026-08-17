import type { RelatedSeriesType } from '../types/relatedSeries';

import pkg from 'sqlite3';
import * as SeriesModel from './series';
import type { SeriesType } from '../types/series';

// 関連シリーズの取得
export function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<RelatedSeriesType[]>((resolve, reject) => {
        db.all<RelatedSeriesType>(
            'SELECT r.seriesId, s.title as seriesTitle, r.description, r.isMedia ' +
            'FROM related_series as r ' +
            'JOIN series as s ON s.id = r.seriesId ' +
            'WHERE r.relatedType = ? AND r.relatedId = ?',
            [relatedType, relatedId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// 関連シリーズの登録
export async function add(db: pkg.Database, relatedType: string,  relatedId: number, relatedSeries: RelatedSeriesType) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            if (relatedSeries.seriesId == null) {
                const series: SeriesType = {
                    id: null,
                    index: relatedSeries.seriesTitle,
                    title: relatedSeries.seriesTitle,
                    originalTitle: '',
                    seriesType: relatedSeries.isMedia == 0 ? '作品' : '雑誌',
                    publisherId: null,
                    description: '',
                    bookReviewTarget: null,
                    publisher: null
                };
                const result = await SeriesModel.update(db, series);
                if (result != null && result.id != null) {
                    relatedSeries.seriesId = result.id;
                }
            }
            const sql = 'INSERT INTO related_series (relatedType, relatedId, seriesId, isMedia, description) VALUES (?, ?, ?, ?, ?)';
            const params = [relatedType, relatedId, relatedSeries.seriesId, relatedSeries.isMedia, relatedSeries.description];
            db.run(sql, params, async function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (e: unknown) {
            reject(e);
        }
    });    
}

// 関連シリーズの削除
export async function deleteAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM related_series WHERE relatedType = ? AND relatedId = ?', [relatedType, relatedId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
