import type { PersonType } from '../types/person';
import type { RelatedPersonType } from '../types/relatedPerson';

import pkg from 'sqlite3';
import * as PersonsModel from './persons';

// 関連人物を取得する
export function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<RelatedPersonType[]>((resolve, reject) => {
        db.all<RelatedPersonType>(
            'SELECT r.relatedType, r.relatedId, r.orderNo, r.personId, p.name as personName, r.role, r.description ' +
            'FROM related_persons as r ' +
            'JOIN persons as p ON p.id = r.personId ' +
            'WHERE r.relatedType = ? AND r.relatedId = ?' +
            'ORDER by r.orderNo',
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

// 関連人物を取得する
export function getAllReatedPersons(db: pkg.Database, relatedType: string) {
    return new Promise<RelatedPersonType[]>((resolve, reject) => {
        db.all<RelatedPersonType>(
            'SELECT r.relatedType, r.relatedId, r.orderNo, r.personId, p.name as personName, r.role, r.description ' +
            'FROM related_persons as r ' +
            'JOIN persons as p ON p.id = r.personId ' +
            'WHERE r.relatedType = ? ',
            [relatedType],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// 関連人物の登録
export async function add(db: pkg.Database, relatedType: string, relatedId: number, relatedPerson: RelatedPersonType) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            if (relatedPerson.personId == null) {
                const person: PersonType = {
                    id: null,
                    index: relatedPerson.personName,
                    name: relatedPerson.personName,
                    kana: '',
                    born: '',
                    died: '',
                    description: '',
                    relatedLinks: null
                };
                const result = await PersonsModel.update(db, person);
                if (result != null && result.id != null) {
                    relatedPerson.personId = result.id;
                }
            }
            const sql = 'INSERT INTO related_persons (relatedType, relatedId, orderNo, personId, role, description) VALUES (?, ?, ?, ?, ?, ?)';
            const params = [relatedType, relatedId, relatedPerson.orderNo, relatedPerson.personId, relatedPerson.role, relatedPerson.description];
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

// 関連人物の削除
export async function deleteAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM related_persons WHERE relatedType = ? AND relatedId = ?', [relatedType, relatedId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

