import type { PrintType, PrintViewType, PrintListViewItemType } from '../types/print';

import pkg from 'sqlite3';
import * as PublishersModel from './publishers';
import * as BrandsModel from './brands';
import * as SeriesModel from './series';
import * as ContentsModel from './contents';
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
                    row.contents = await ContentsModel.getByPrint(db, row.id) ?? [];
                    row.relatedPersons = await RelatedPersonsModel.getAll(db, 'PRINT', row.id);
                    row.relatedWorks = await RelatedWorksModel.getAll(db, 'PRINT', row.id);
                    row.relatedLinks = await RelatedLinksModel.getAll(db, 'PRINT', row.id);
                }
                resolve(row);
            }
        });
    });
}

// 更新用パラメータの配列を返す。
function makeUpdateParams(print: PrintType) {
    const ar = [
        print.title,
        print.originalTitle,
        print.printType,
        print.publisherId,
        print.brandId,
        print.publicationDate,
        print.issueNumber,
        print.seriesId,
        print.purchaseDate,
        print.finishedReadingDate,
        print.description,
        print.toc,
        print.note,
        print.ownedType
    ];
    if (print.id) {
        ar.push(print.id)
    }
    return ar;
}

// 印刷物を更新する
export async function update(db: pkg.Database, print: PrintType) {
    return new Promise<PrintType>(async (resolve, reject) => {
        if (print.publisherId == null && print.publisher != null && print.publisher.name != '') {
            const ret = await PublishersModel.update(db, print.publisher);
            print.publisherId = ret.id;
        }
        if (print.brandId == null && print.brand != null && print.brand.name != '') {
            const ret = await BrandsModel.update(db, print.brand);
            print.brandId = ret.id;
        }
        if (print.seriesId == null && print.series != null && print.series.index != '') {
            const ret = await SeriesModel.update(db, print.series);
        }
        const [sql, params] = print.id === null
            ? [
                'INSERT INTO prints (title , originalTitle, printType, publisherId, brandId, publicationDate, issueNumber, seriesId, ' +
                'purchaseDate, finishedReadingDate, description, toc, note, ownedType) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                makeUpdateParams(print)
            ]
            : [
                'UPDATE prints SET title = ? , originalTitle = ?, printType = ?, publisherId = ?, brandId = ?, publicationDate = ?, ' +
                'issueNumber = ?, seriesId = ?, purchaseDate = ?, finishedReadingDate = ?, description = ?, toc = ?, note = ?, ownedType = ? WHERE id = ?',
                makeUpdateParams(print)
            ];
        db.run(sql, params, async function (err) {
            if (err) {
                reject(err);
            } else {
                if (print.id === null) {
                    print.id = this.lastID;
                } else {
                    await RelatedPersonsModel.deleteAll(db, 'PRINT', print.id);
                    await RelatedLinksModel.deleteAll(db, 'PRINT', print.id);
                    await RelatedWorksModel.deleteAll(db, 'PRINT', print.id);
                    await ContentsModel.deleteAll(db, print.id);
                }
                if (print.relatedPersons != null && print.relatedPersons.length > 0) {
                    for (const relatedPerson of print.relatedPersons) {
                        await RelatedPersonsModel.add(db, 'PRINT', print.id, relatedPerson);
                    }
                }
                if (print.relatedLinks != null && print.relatedLinks.length > 0) {
                    for (const relatedLink of print.relatedLinks) {
                        await RelatedLinksModel.add(db, 'PRINT', print.id, relatedLink);
                    }
                }s
                if (print.relatedWorks != null && print.relatedWorks.length > 0) {
                    for (const relatedWork of print.relatedWorks) {
                        await RelatedWorksModel.add(db, 'PRINT', print.id, relatedWork);
                    }
                }                
                if (print.contents != null && print.contents.length > 0) {
                    for (const content of print.contents) {
                        await ContentsModel.add(db, print.id, content);
                    }
                }
                resolve(print);
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


