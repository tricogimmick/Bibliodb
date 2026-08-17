import type { TagType } from "../types/tag";

import pkg from 'sqlite3';

// タグを取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<TagType>((resolve, reject) => {
        db.get<TagType>('SELECT * FROM tags WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// タグをタグ名より取得する
export function getByTag(db: pkg.Database, tag: string) {
    return new Promise<TagType>((resolve, reject) => {
        db.get<TagType>('SELECT * FROM tags WHERE tag = ?', [tag], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


// 全てのタグを取得する
export function getAll(db: pkg.Database) {
    return new Promise<TagType[]>((resolve, reject) => {
        db.all<TagType>('SELECT * FROM tags ORDER BY name, id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// タグを登録する
export function update(db: pkg.Database, tag: TagType) {
    const [sql, params] = tag.id === null
        ? ['INSERT INTO tags (tag) VALUES (?)', [tag.tag]]
        : ['UPDATE tags SET tag = ? WHERE id = ?', [tag.tag, tag.id]];
    return new Promise<TagType>((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                if (tag.id === null) {
                    tag.id = this.lastID;
                }
                resolve(tag);
            }
        });
    });
}

