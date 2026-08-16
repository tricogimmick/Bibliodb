import pkg from 'sqlite3';
import type { PrintViewType } from '../types/print';

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


