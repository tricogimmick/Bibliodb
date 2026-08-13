import type { PublisherType } from "./publisher";

// シリーズの型定義
export type SeriesType = {
    id: number|null;
    index: string;
    title: string;
    originalTitle: string;
    seriesType: string;
    publisherId: number | null;
    description: string;
    bookReviewTarget: number | null;
    // ここから下は関連情報
    publisher: PublisherType|null;
};

// シリーズの作成する
export function createSeriesType(id: number | null = null, index: string = '', seriesType: string = '', publisherId: number | null = null): SeriesType {
    return {
        id,
        index: index,
        title: index,
        originalTitle: '',
        seriesType,
        publisherId,
        description: '',
        bookReviewTarget: null,
        publisher: null
    };
}