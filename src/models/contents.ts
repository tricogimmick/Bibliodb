import type { ContentListViewItemType } from '../types/content'

import pkg from 'sqlite3';
import * as RelatedPersonsModel from './relatedPersons';

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
