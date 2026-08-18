import type { RelatedWorkType } from '../types/relatedWork';

import pkg from 'sqlite3';

// 関連人物を取得する
export function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<RelatedWorkType[]>((resolve, reject) => {
        db.all<RelatedWorkType>(
            'SELECT r.relatedType, r.relatedId, r.workId, w.title as workName, r.description ' +
            'FROM related_works as r ' +
            'JOIN works as w ON w.id = r.workId ' +
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
