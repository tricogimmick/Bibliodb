import type { PrintType, PrintViewType, PrintListViewItemType } from '../types/print';

import pkg from 'sqlite3';
import * as PublishersModel from './publishers';
import * as BrandsModel from './brands';
import * as SeriesModel from './series';
import * as RelatedPersonsModel from './relatedPersons';
import * as RelatedWorksModel from './relatedWorks';
import * as RelatedLinksModel from './relatedLinks';

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
    return new Promise<PrintType>((resolve, reject) => {
        db.get<PrintType>('SELECT * FROM prints WHERE id = ?', [printId], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row.id) {
                    row.publisher = row.publisherId ? await PublishersModel.get(db, row.publisherId) : null;
                    row.brand = row.brandId ? await BrandsModel.get(db, row.brandId) : null;
                    row.series = row.seriesId ? await SeriesModel.get(db, row.seriesId) : null;
                    row.relatedPersons = await RelatedPersonsModel.getAll(db, 'PRINT', row.id);
                    row.relatedWorks = await RelatedWorksModel.getAll(db, 'PRINT', row.id);
                    row.relatedLinks = await RelatedLinksModel.getAll(db, 'PRINT', row.id);
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


