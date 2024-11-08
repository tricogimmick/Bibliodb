import { json } from '@sveltejs/kit';
import pkg from 'sqlite3';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';
import type { PersonType  } from '../../../types/person';

const {Database} = pkg;

const appendPerson = (db: pkg.Database, person: PersonType) => new Promise<PersonType|Error>((ok, ng) => {
    db.run("INSERT INTO persons ([index], name, kana, born, died, description) VALUES (?, ?, ?, ?, ?, ?)",
        [ person.index, person.name, person.kana, person.born, person.died, person.description ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok({
                    id: this.lastID,
                    index: person.index,
                    name: person.name,
                    kana: person.kana,
                    born: person.born,
                    died: person.died,
                    description: person.description
                });
            }
        }
    );
});

const updatePerson = (db: pkg.Database, person: PersonType) => new Promise<PersonType|Error>((ok, ng) => {
    db.run("UPDATE persons SET [index] = ?, name = ?, kana = ?, born = ?, died = ?, description = ? WHERE id = ?",
        [ person.index, person.name, person.kana, person.born, person.died, person.description, person.id ],
        function(error) {
            if (error) {
                ng(error);
            } else {
                ok(person);
            }
        }
    );
});

export const POST: RequestHandler = async ({ request }) => {
	const person : PersonType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendPerson(db, person);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const person : PersonType = await request.json();
    const dbPath = env["LIBMANDB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updatePerson(db, person);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: e })
    } finally {
        db.close();
    }
};