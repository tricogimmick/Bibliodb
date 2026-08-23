import type { SeriesType } from './series';
import type { RelatedPersonType } from './relatedPerson';
import type { RelatedLinkType } from './relatedLink';

export type MovieType = {
    id: number | null;
    title: string;
    originalTitle: string;
    seriesId: number | null;
    country: string;
    releaseYear: string;
    description: string;
    note: string;
    viewingDate: string;
    viewingMethod: string;

    // ここから下は関連情報
    series: SeriesType | null;
    relatedPersons: RelatedPersonType[] | null;
    relatedLinks: RelatedLinkType[] | null;
};

export type MovieListViewItemType = {
    id: number;
    title: string;
    country: string;
    releaseYear: string;
}

// 映画を作成する
export function createMovieType() {
    return ({
        id: null,
        title: '',
        originalTitle: '',
        seriesId: null,
        country: '',
        releaseYear: '',
        description: '',
        note: '',
        viewingDate: '',
        viewingMethod: '',
        series: null,
        relatedPersons: null,
        relatedLinks: null
    } as MovieType)
}
