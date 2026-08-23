import type { SeriesType } from './series';

export type CollectionType = {
    id: number | null;
    title: string;
    seriesId: number | null;
    issue: string;
    collectionType: string;
    description: string;
    note:  string;

    // ここから下は関連情報
    series: SeriesType | null;
}

export function createCollectionType() {
    return ({
        id: null,
        title: '',
        seriesId: null,
        issue: '',
        collectionType: '',
        description: '',
        note:  '',
        series: null
    });
}