import pkg from 'sqlite3';
import type { PublisherType } from '../types/publisher';

// 出版社を作成する
export function create(name: string = '', description: string = '') {
    return { id: null, name, description } as PublisherType;
}

// 出版社を取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<PublisherType>((resolve, reject) => {
        db.get<PublisherType>('SELECT * FROM publishers WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// 全ての出版社を取得する
export function getAll(db: pkg.Database) {
    return new Promise<PublisherType[]>((resolve, reject) => {
        db.all<PublisherType>('SELECT * FROM publishers ORDER BY name, id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 出版社を更新する
export function update(db: pkg.Database, publisher: PublisherType) {
    const [sql, params] = publisher.id === null
        ? ['INSERT INTO publishers (name, description) VALUES (?, ?)', [publisher.name, publisher.description]]
        : ['UPDATE publishers SET name = ?, description = ? WHERE id = ?', [publisher.name, publisher.description, publisher.id]];
    return new Promise<PublisherType>((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                if (publisher.id === null) {
                    publisher.id = this.lastID;
                }
                resolve(publisher);
            }
        });
    });
}

// 出版社を削除する
export function remove(db: pkg.Database, publisher: PublisherType) {
    if (publisher.id === null) {
        return Promise.reject(new Error('Publisher ID is null'));
    }
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM publishers WHERE id = ?', [publisher.id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}    
