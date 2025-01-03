import type { RequestHandler } from './$types';
import type { PersonType  } from '../../../types/person';

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pkg from 'sqlite3';
const {Database} = pkg;

import { getAllPersons } from '$lib/common';

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
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await appendPerson(db, person) as PersonType;
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const PUT: RequestHandler = async ({ request }) => {
	const person : PersonType = await request.json();
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await updatePerson(db, person) as PersonType;
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
};

export const GET: RequestHandler = async ({ url }) => {
    const dbPath = env["BIBLIODB_PATH"] ?? "";
    const db = new Database(dbPath);
    try {
        const result = await getAllPersons(db);
        return json({ ok: true, data: result })
    } catch (e: any) {
        return json({ ok: false, data: (e as Error).message })
    } finally {
        db.close();
    }
}
