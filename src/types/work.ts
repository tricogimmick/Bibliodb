import type { RelatedLinkType } from "./relatedLink";
import type { RelatedPersonType } from "./relatedPerson";
import type { RelatedSeriesType } from "./relatedSeries";
import type { RelatedCollectionType } from "./relatedCollection";

export type WorkType = {
    id: number | null;
    index: string;
    title: string;
    variantTitles: string;
    originalTitle: string;
    contentType: string;
    synopsis: string;
    description: string;
    note: string;
    publicationYear: number | null;
    publicationEndYear: number | null;
    seqNo: number | null;
    finishedReading: string;
    status: string;
    // ここから下は関連情報
    relatedPersons: RelatedPersonType[] | null;
    relatedSeries: RelatedSeriesType[] | null;
    relatedLinks: RelatedLinkType[] | null;
    relatedCollections: RelatedCollectionType[] | null;
    tags: string[] | null;
};

export type WorkListViewItemType = {
    id: number;
    title: string;
    publicationYear: number;
    contentType: string;    
}

// 新規の作品を作成する
export function createWork() {
    return ({
        id: null,
        index: '',
        title: '',
        variantTitles: '',
        originalTitle: '',
        contentType: '',
        synopsis: '',
        description: '',
        note: '',
        publicationYear: null,
        publicationEndYear: null,
        seqNo: null,
        finishedReading: '',
        status: '',
        relatedPersons: null,
        relatedSeries: null,
        relatedLinks: null,
        relatedCollections: null,
        tags: null
    });
}