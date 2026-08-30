import type { RelatedCollectionType } from '../types/relatedCollection';
import type { CollectionType } from '../types/collection';

import pkg from 'sqlite3';
import * as CollectionsModel from './collections';

// 関連コレクションの取得
export function getAll(db: pkg.Database, relatedType: string, relatedId: number) {
	return new Promise<RelatedCollectionType[]>((resolve, reject) => {
		db.all<RelatedCollectionType>(
			'SELECT r.collectionId, c.title as collectionTitle, r.description ' +
				'FROM related_collections as r ' +
				'JOIN collections as c ON c.id = r.collectionId ' +
				'WHERE r.relatedType = ? AND r.relatedId = ?',
			[relatedType, relatedId],
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

// 関連シリーズの登録
export async function add(
	db: pkg.Database,
	relatedType: string,
	relatedId: number,
	relatedCollection: RelatedCollectionType
) {
	return new Promise<void>(async (resolve, reject) => {
		try {
			if (relatedCollection.collectionId == null) {
				const collection: CollectionType = {
					id: null,
					title: relatedCollection.collectionTitle,
					seriesId: null,
					term: null,
					issue: '',
					collectionType: '本のリスト',
					description: '',
					note: '',
					series: null
				};
				const result = await CollectionsModel.update(db, collection);
				if (result != null && result.id != null) {
					relatedCollection.collectionId = result.id;
				}
			}
			const sql =
				'INSERT INTO related_collections (relatedType, relatedId, collectionId, description) VALUES (?, ?, ?, ?)';
			const params = [
				relatedType,
				relatedId,
				relatedCollection.collectionId,
				relatedCollection.description
			];
			db.run(sql, params, async function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		} catch (e: unknown) {
			reject(e);
		}
	});
}

// 関連コレクションの削除
export async function deleteAll(db: pkg.Database, relatedType: string, relatedId: number) {
	return new Promise<void>((resolve, reject) => {
		db.run(
			'DELETE FROM related_collections WHERE relatedType = ? AND relatedId = ?',
			[relatedType, relatedId],
			function (error) {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}
		);
	});
}
