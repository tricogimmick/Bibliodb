import pkg from 'sqlite3';
import type { PrintType, PrintViewType, PrintListViewItemType } from '../types/print';

// 全ての印刷物を取得する
export function getAll(db: pkg.Database) {
    return new Promise<PrintType[]>((resolve, reject) => {
        db.all<PrintType>('SELECT * FROM prints ORDER BY title', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 印刷物を取得する
export function get(db: pkg.Database, printId: number) {
    return new Promise<PrintType[]>((resolve, reject) => {
        db.get<PrintType>('SELECT * FROM prints WHERE id = ?', [printId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row.id) {
                    
                }
                resolve(row);
            }
        });
    });
}

// 関連出版物を取得する
export async function getListViewAll(db: pkg.Database) {
    return new Promise<PrintListViewItemType[]>((resolve, reject) => {
        db.all<PrintListViewItemType>(
            "SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.printType, bk.ownedType, bk.issueNumber " +
            "FROM prints as bk " +
            "LEFT JOIN series as sr on sr.id = bk.seriesId " +
            "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
            "LEFT JOIN brands as br ON br.id = bk.brandId " +
            "ORDER BY bk.publicationDate",
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}



// シリーズに関連する印刷物を取得する
export function getRelatedPrintsBySeriesId(db: pkg.Database, seriesId: number) {
    return new Promise<PrintViewType[]>((resolve, reject) => {
        db.all<PrintViewType>(
            'SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, ' +
            'bk.publicationDate, bk.printType, bk.ownedType, bk.issueNumber, null as orderNo ' +
            'FROM prints as bk ' + 
            'LEFT JOIN series as sr on sr.id = bk.seriesId ' +
            'LEFT JOIN publishers as pb ON pb.id = bk.publisherId ' +
            'LEFT JOIN brands as br ON br.id = bk.brandId ' +
            'WHERE bk.seriesId = ? ' +
            'ORDER BY bk.publicationDate',
            [seriesId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// 作品に関連する印刷物を取得する
export function getRelatedPrintsByWorkId(db: pkg.Database, workId: number) {
    return new Promise<PrintViewType[]>((resolve, reject) => {
        db.all<PrintViewType>(
            'SELECT bk.id, sr.title as series, bk.title, pb.name as publisher,  br.name as brand, ' +
            'bk.publicationDate, bk.printType, bk.ownedType, bk.issueNumber, ct.orderNo ' +
            'FROM contents as ct ' +
            'JOIN prints as bk on bk.id = ct.printId ' +
            'LEFT JOIN series as sr on sr.id = bk.seriesId ' +
            'LEFT JOIN publishers as pb ON pb.id = bk.publisherId ' +
            'LEFT JOIN brands as br ON br.id = bk.brandId ' +
            'WHERE ct.workId = ? ' +
            'ORDER BY bk.publicationDate',
            [workId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}


