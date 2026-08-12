import type { RelatedPersonType } from '../types/person';

import pkg from 'sqlite3';

// 関連人物を取得する
export async function getRelatedPersonsByPrintId(db: pkg.Database, printId: number) : Promise<RelatedPersonType[]>
{
    return new Promise<RelatedPersonType[]>((resolve, reject) => {
        db.all<RelatedPersonType>(
            "SELECT r.orderNo, r.personId, p.name as personName, r.role, r.description " +
            "FROM related_persons as r " +
            "JOIN persons as p ON p.id = r.personId " +
            "WHERE r.relatedType = 'PRINT' AND  r.relatedId = ?",
            [printId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}