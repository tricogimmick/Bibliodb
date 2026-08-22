import type { ContentType, ContentListViewItemType } from '../types/content'

import pkg from 'sqlite3';
import * as RelatedPersonsModel from './relatedPersons';

// 関連コンテンツを取得する
export async function getByPrint(db: pkg.Database, printId: number) {
    return new Promise<ContentType[]>((resolve, reject) => {
        db.all<ContentType>("SELECT * FROM contents WHERE printId = ? ORDER BY orderNo", [printId], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 関連コンテンツを取得する
export async function getListViewByPrint(db: pkg.Database, printId: number) {
    return new Promise<ContentListViewItemType[]>((resolve, reject) => {
        db.all<ContentListViewItemType>(
            "SELECT ct.orderNo, ct.workId, CASE WHEN ct.workId IS null THEN ct.title ELSE wk.title END as title, " +
            "ct.subTitle, ct.description, ct.pageNo, ct.color, ct.publishType " +
            "FROM contents as ct " +
            "LEFT JOIN works as wk ON wk.id = ct.workId " +
            "WHERE ct.printId = ? ORDER BY ct.orderNo", 
            [printId],
            async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // コンテンツの関連人物を取得
                    for (const row of rows) {
                        row.relatedPersons = await RelatedPersonsModel.getAll(db, 'WORK', row.workId);
                    }
                    resolve(rows);
                }
            });
    });
}

// 更新用パラメータの配列を返す。
function makeUpdateParams(printId: number, content: ContentType) {
    return ;
}

// 関連コンテンツの更新
export async function add(db: pkg.Database, printId: number, content: ContentType) {
    return new Promise<ContentType>((resolve, reject) => {
        const sql = 'INSERT INTO contents (printId, orderNo, workId, title, subTitle, pageNo, publishType, serializationStatus, color, firstPublished, description) ' +
                    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [
                printId, 
                content.orderNo, 
                content.workId, 
                content.title, 
                content.subTitle, 
                content.pageNo, 
                content.publishType, 
                content.serializationStatus, 
                content.color, 
                content.firstPublished, 
                content.description
            ]
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
}

// 関連コンテンツの削除
export async function deleteAll(db: pkg.Database, printId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM contents WHERE printId = ?', [printId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}