import type { RelatedTagType } from '../types/relatedTag';

import pkg from 'sqlite3';
import * as TagsModel from './tags';

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

