export type SeriesType = {
    id: number|null;
    index: string;
    title: string;
    originalTitle: string;
    seriesType: string;
    publisherId: Number | null;
    description: string;
    bookReviewTarget: Number | null;
};

export function createSeriesType(id: number | null = null, index: string = '', seriesType: string = '', publisherId: Number | null = null): SeriesType {
    return {
        id,
        index: index,
        title: index,
        originalTitle: '',
        seriesType,
        publisherId,
        description: '',
        bookReviewTarget: null
    };
}