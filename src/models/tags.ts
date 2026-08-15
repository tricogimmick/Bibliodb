import type { TagType } from "../types/tag";

import pkg from 'sqlite3';

// 関連するタグを取得する
export function getRelatedTags(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<string[]>((resolve, reject) => {
        db.all<string>(
            'SELECT t.tag ' +
            'FROM related_tags as r ' +
            'JOIN tags as t ON t.id = r.tagId ' +
            'WHERE r.relatedType = ? AND r.relatedId = ?' +
            'ORDER by t.tag',
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