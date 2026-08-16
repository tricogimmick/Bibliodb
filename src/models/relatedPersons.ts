import type { RelatedPersonType } from '../types/relatedPerson';

import pkg from 'sqlite3';

// 関連人物の登録
export async function add(db: pkg.Database, relatedType: string,  relatedId: number, relatedPerson: RelatedPersonType) {
    const sql = 'INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [relatedType, relatedId, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description];
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

