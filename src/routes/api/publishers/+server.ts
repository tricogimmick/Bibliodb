import type { RequestHandler } from './$types';
import type { PublisherType } from '../../../types/publisher';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

const appendPublisher = (db: pkg.Database, publisher: PublisherType) => new Promise<PublisherType|Error>((ok, ng) => {
    db.run("INSERT INTO publishers (name,description) VALUES (?, ?)",
        [ publisher.name, publisher.description ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok({
                    id: this.lastID,
                    name: publisher.name,
                    description: publisher.description
                });
            }
        }
    );
});

const updatePublisher = (db: pkg.Database, publisher: PublisherType) => new Promise<PublisherType|Error>((ok, ng) => {
    db.run("UPDATE publishers SET name = ?, description = ? WHERE id = ?",
        [ publisher.name, publisher.description, publisher.id ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok(publisher);
            }
        }
    );
});

export const POST: RequestHandler = async ({ request }) => {
	const person : PublisherType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendPublisher(db, person);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const person : PublisherType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updatePublisher(db, person);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};