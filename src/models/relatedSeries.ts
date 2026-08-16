import type { RelatedSeriesType } from '../types/relatedSeries';

import pkg from 'sqlite3';

// 関連シリーズの登録
export async function add(db: pkg.Database, relatedType: string,  relatedId: number, relatedSeries: RelatedSeriesType) {
    const sql = 'INSERT INTO related_series (relatedType, relatedId, seriesId, isMedia, description) VALUES (?, ?, ?, ?, ?)';
    const params = [relatedType, relatedId, relatedSeries.seriesId, relatedSeries.isMedia, relatedSeries.description];
    return new Promise<void>((resolve, reject) => {
        db.run(sql, params, async function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });    
}

