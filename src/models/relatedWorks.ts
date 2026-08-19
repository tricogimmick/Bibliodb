import RelatedWorksEditor from '../components/RelatedWorksEditor.svelte';
import type { RelatedWorkType } from '../types/relatedWork';

import pkg from 'sqlite3';
import * as WorksModel from './works'

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

// 関連作品の登録
export async function add(db: pkg.Database, relatedType: string, relatedId: number, relatedWork: RelatedWorkType) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            if (relatedWork.workId == null) {
                const work: WorkType = {
                    index: relatedWork.workName,
                    title: relatedWork.workName,
                    variantTitles: '',
                    originalTitle: '',
                    contentType: '',
                    synopsis: '',
                    description: '',
                    note: '',
                    publicationYear: null,
                    publicationEndYear: null,
                    seqNo: null,
                    finishedReading: '',
                    status: ''
                };
                const result = await WorksModel.update(db, work);
                if (result != null && result.id != null) {
                    relatedWork.workId = result.id;
                }
            }
            const sql = 'INSERT INTO related_works (relatedType, subType, relatedId, workId, description) VALUES (?, ?, ?, ?, ?)';
            const params = [relatedType, relatedWork.subType, relatedId, relatedWork.workId, relatedWork.description];
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
        db.run('DELETE FROM related_works WHERE relatedType = ? AND relatedId = ?', [relatedType, relatedId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

