import type { PublisherType } from './publisher';
import type { BrandType } from './brand';
import type { SeriesType } from './series';
import type { RelatedPersonType } from './relatedPerson';
import type { RelatedWorkType } from './relatedWork';
import type { RelatedLinkType } from './relatedLink'
import type { RelatedCollectionType } from './relatedCollection';
import type { ContentType } from './content';

export type PrintType = {
    id: number | null;
    title: string;
    originalTitle: string;
    printType: string;
    publisherId: number | null;
    brandId: number | null;
    publicationDate: string;
    issueNumber: number | null;
    seriesId: number | null;
    purchaseDate: string;
    finishedReadingDate: string;
    description: string;
    toc: string;
    note: string;
    ownedType: string;

    // ここから下は関連情報
    publisher: PublisherType | null;
    brand: BrandType | null;
    series: SeriesType | null;
    relatedPersons: RelatedPersonType[] | null;
    relatedWorks: RelatedWorkType[] | null;
    relatedLinks: RelatedLinkType[] | null;
    relatedCollections: RelatedCollectionType[] | null;
    contents: ContentType[] | null;
    tags: string[] | null;
}

export function createPrintType() {
    return ({
        id: null,
        title: '',
        originalTitle: '',
        printType: '書籍',
        publisherId: null,
        brandId: null,
        publicationDate: '',
        issueNumber: null,
        seriesId: null,
        purchaseDate: '',
        finishedReadingDate: '',
        description: '',
        toc: '',
        note: '',
        ownedType: '',
        publisher: null,
        brand: null,
        series: null,
        relatedPersons: null,
        relatedWorks: null,
        relatedLinks: null,
        relatedCollections: null,
        contents: null,
        tags: null
    });
}

export type PrintViewType = {
    id: number;
    series: string,
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    printType: string;
    ownedType: string;
    issueNumber: number | null;
    orderNumber: number | null;
}    

export type PrintListViewItemType = {
    id: number;
    series: string;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    printType: string;
    ownedType: string;
    issueNumber: number | null;
}

export type BoookListViewItemType = {
    id: number;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    ownedType: string;
    finishedReadingDate: string;
    authors: RelatedPersonType[];
}

export type MagazineListViewItemType = {
    id: number;
    series: string;
    title: string;
    publisher: string;
    publicationDate: string;
    ownedType: string;
    orderNo: number | null;
}