import type { RequestHandler } from './$types';
import type { SeriesType } from '../../../types/series';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

const appendSeries = (db: pkg.Database, series: SeriesType) => new Promise<SeriesType|Error>((ok, ng) => {
    db.run("INSERT INTO series (nameIndex, title, originalTitle, seriesType, publisherId, description) VALUES (?, ?, ?, ?, ?, ?)",
        [ series.nameIndex, series.title, series.originalTitle, series.seriesType, series.publisherId, series.description ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok({
                    id: this.lastID,
                    nameIndex: series.nameIndex,
                    title: series.title,
                    originalTitle: series.originalTitle,
                    seriesType: series.seriesType,
                    publisherId: series.publisherId,
                    description: series.description
                });
            }
        }
    );
});

const updateSeries = (db: pkg.Database, series: SeriesType) => new Promise<SeriesType|Error>((ok, ng) => {
    db.run("UPDATE series SET nameIndex = ?, title = ?, originalTitle = ?, seriesType = ?, publisherId = ?, description = ? WHERE id = ?",
        [ series.nameIndex, series.title, series.originalTitle, series.seriesType, series.publisherId, series.description, series.id ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok(series);
            }
        }
    );
});

export const POST: RequestHandler = async ({ request }) => {
	const series : SeriesType = await request.json();

    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendSeries(db, series);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const series : SeriesType = await request.json();

    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updateSeries(db, series);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};