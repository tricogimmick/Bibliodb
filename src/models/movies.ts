import type { MovieType, MovieListViewItemType } from '../types/movie'

import pkg from 'sqlite3';
import * as SeriesModel from './series';
import * as RelatedPersonsModel from './relatedPersons';
import * as RelatedLinksModel from './relatedLinks';

// 全ての映画を取得する
export function getAll(db: pkg.Database) {
    return new Promise<MovieType[]>((resolve, reject) => {
        db.all<MovieType>('SELECT * FROM movies ORDER BY viewingDate desc, title', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 映画を取得する
export function get(db: pkg.Database, movieId: number) {
    return new Promise<MovieType>((resolve, reject) => {
        db.get<MovieType>('SELECT * FROM movies WHERE id = ?', [movieId], async (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row.id) {
                    row.series = row.seriesId ? await SeriesModel.get(db, row.seriesId) : null;
                    row.relatedPersons = await RelatedPersonsModel.getAll(db, 'MOVIE', row.id);
                    row.relatedLinks = await RelatedLinksModel.getAll(db, 'MOVIE', row.id);                    
                }
                resolve(row);
            }
        });
    });
}

// 更新用パラメータの配列を返す。
function makeUpdateParams(movie: MovieType) {
    const ar = [
        movie.title,
        movie.originalTitle,
        movie.seriesId,
        movie.country,
        movie.releaseYear,
        movie.description,
        movie.note,
        movie.viewingDate,
        movie.viewingMethod
    ];
    if (movie.id) {
        ar.push(movie.id)
    }
    return ar;
}

// 映画を更新する
export async function update(db: pkg.Database, movie: MovieType) {
    return new Promise<MovieType>(async (resolve, reject) => {
        if (movie.seriesId == null && movie.series != null && movie.series.index != '') {
            const ret = await SeriesModel.update(db, movie.series);
            movie.seriesId = ret.id;
        }
        const [sql, params] = movie.id === null
            ? [
                'INSERT INTO movies (title , originalTitle, seriesId, country, releaseYear, description, note, viewingDate, viewingMethod) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                makeUpdateParams(movie)
            ]
            : [
                'UPDATE movies SET title = ? , originalTitle = ?, seriesId = ?, country = ?, releaseYear = ?, description = ?, ' +
                'note = ?, viewingDate = ?, viewingMethod = ? WHERE id = ?',
                makeUpdateParams(movie)
            ];
        db.run(sql, params, async function (err) {
            if (err) {
                reject(err);
            } else {
                if (movie.id === null) {
                    movie.id = this.lastID;
                } else {
                    await RelatedPersonsModel.deleteAll(db, 'MOVIE', movie.id);
                    await RelatedLinksModel.deleteAll(db, 'MOVIE', movie.id);
                }
                if (movie.relatedPersons != null && movie.relatedPersons.length > 0) {
                    for (const relatedPerson of movie.relatedPersons) {
                        await RelatedPersonsModel.add(db, 'MOVIE', movie.id, relatedPerson);
                    }
                }
                if (movie.relatedLinks != null && movie.relatedLinks.length > 0) {
                    for (const relatedLink of movie.relatedLinks) {
                        await RelatedLinksModel.add(db, 'MOVIE', movie.id, relatedLink);
                    }
                }
                resolve(movie);
            }
        });
    });
}

// 関連映画を取得する
export async function getRelatedMoviesByPersonId(db: pkg.Database, personId: number) {
    return new Promise<MovieListViewItemType[]>((resolve, reject) => {
        db.all<MovieListViewItemType>(
            "SELECT DISTINCT m.id, m.title, m.country, m.releaseYear " +
            "FROM related_persons as rp " +
            "JOIN movies as m ON m.id = rp.relatedId " +
            "WHERE rp.relatedType = 'MOVIE' and rp.personId = ?  " +
            "ORDER BY m.releaseYear desc, m.title",
            [personId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}
