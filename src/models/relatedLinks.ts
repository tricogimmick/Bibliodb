import type { RelatedLinkType } from '../types/relatedLink';

import pkg from 'sqlite3';

// 紐付く全てのリンクを取得する。
export async function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<RelatedLinkType[]>((resolve, reject) => {
        db.all<RelatedLinkType>(
            "SELECT * FROM related_links WHERE relatedType = ? AND relatedId = ?",
            [relatedType, relatedId],
            function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

// リンクを作成する
export async function add(db: pkg.Database, relatedType: string, relatedId: number,  relatedLink: RelatedLinkType) {
    return new Promise<RelatedLinkType>((resolve, reject) => {
        db.run(
            'INSERT INTO related_links (relatedType, relatedId, linkType, url, alt, description) VALUES (?, ?, ?, ?, ?, ?)',
            [relatedType, relatedId, relatedLink.linkType, relatedLink.url, relatedLink.alt, relatedLink.description],
            function (error) {
                if (error) {
                    reject(error);
                } else {
                    relatedLink.id = this.lastID;
                    relatedLink.relatedType = relatedType;
                    relatedLink.relatedId = relatedId;
                    resolve(relatedLink);
                }
            });
    });
}

// 紐付く全てのリンクを削除する
export async function deleteAll(db: pkg.Database, relatedType: string, relatedId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM related_links WHERE relatedType = ? AND relatedId = ?', [relatedType, relatedId], function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}