import type { RelatedPersonType } from './relatedPerson'

export type ContentType = {
    printId: number | null;
    orderNo: number | null;
    workId: number | null;
    title: string;
    subTitle: string;
    pageNo: number | null;
    publishType: string;
    serializationStatus: string;
    color: number | null;
    firstPublished: number | null;
    description: string;
}

export type ContentListViewItemType = {
    orderNo: number;
    workId: number;
    title: string;
    subTitle: string;
    description: string;
    pageNo: number | null;
    color: number | null;
    publishType: string;
    relatedPersons: RelatedPersonType[] | null;
}