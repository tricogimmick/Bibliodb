import pkg from 'sqlite3';
import type { BrandType } from '../types/brand';

// ブランドを作成する
export function create(name: string = '', description: string = '') {
    return { id: null, name, description } as BrandType;
}

// ブランドを取得する
export function get(db: pkg.Database, id: number) {
    return new Promise<BrandType>((resolve, reject) => {
        db.get<BrandType>('SELECT * FROM brands WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// 全てのブランドを取得する
export function getAll(db: pkg.Database) {
    return new Promise<BrandType[]>((resolve, reject) => {
        db.all<BrandType>('SELECT * FROM brands ORDER BY name, id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// ブランドを更新する
export function update(db: pkg.Database, brand: BrandType) {
    const [sql, params] = brand.id === null
        ? ['INSERT INTO brands (name, description) VALUES (?, ?)', [brand.name, brand.description]]
        : ['UPDATE brands SET name = ?, description = ? WHERE id = ?', [brand.name, brand.description, brand.id]];
    return new Promise<BrandType>((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                if (brand.id === null) {
                    brand.id = this.lastID;
                }
                resolve(brand);
            }
        });
    });
}

// ブランドを削除する
export function remove(db: pkg.Database, brand: BrandType) {
    if (brand.id === null) {
        return Promise.reject(new Error('Brand ID is null'));
    }
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM brands WHERE id = ?', [brand.id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
