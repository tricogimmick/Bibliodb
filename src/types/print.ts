import type { PublisherType } from './publisher';
import type { BrandType } from './brand';
import type { SeriesType } from './series';
import type { RelatedPersonType } from './relatedPerson';
import type { RelatedWorkType } from './relatedWork';
import type { RelatedLinkType } from './relatedLink'

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
