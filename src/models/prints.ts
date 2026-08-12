import pkg from 'sqlite3';
import type { PrintViewType } from '../types/print';

export function getRelatedPrintsBySeriesId(db: pkg.Database, seriesId: number) {
    return new Promise<PrintViewType[]>((resolve, reject) => {
        db.all<PrintViewType>(
            "SELECT bk.id, bk.title, pb.name as publisher,  br.name as brand, bk.publicationDate, bk.issueNumber, bk.printType " +
            "FROM prints as bk " + 
            "LEFT JOIN publishers as pb ON pb.id = bk.publisherId " +
            "LEFT JOIN brands as br ON br.id = bk.brandId " +
            "WHERE bk.seriesId = ? " +
            "ORDER BY bk.issueNumber, bk.publicationDate",
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


