import type { PublisherType } from "./publisher";
import type { BrandType } from "./brand";
import type { SeriesType } from "./series";

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
}

export type PrintViewType = {
    id: number;
    title: string;
    publisher: string;
    brand: string;
    publicationDate: string;
    issueNumber: number | null;
    printType: string;
}    
