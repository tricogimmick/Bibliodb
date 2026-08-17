import type { RelatedTagType } from '../types/relatedTag';

import pkg from 'sqlite3';
import * as TagsModel from './tags';

// 関連タグを取得する
export function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
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

// 関連タグの登録
export async function add(db: pkg.Database, relatedType: string,  relatedId: number, tagName: string) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let tag = await TagsModel.getByTag(db, tagName);
            if (tag == null || tag.id == null) {
                tag = await TagsModel.update(db, { id: null, tag: tagName});
            }
            const sql = 'INSERT INTO related_tags (relatedType, relatedId, tagId) VALUES (?, ?, ?)';
            const params = [relatedType, relatedId, tag.id];
            db.run(sql, params, function (err) {
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

// 関連タグの削除
export async function deleteAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM related_tags WHERE relatedType = ? AND relatedId = ?', [relatedType, relatedId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}


