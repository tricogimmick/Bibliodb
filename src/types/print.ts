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
