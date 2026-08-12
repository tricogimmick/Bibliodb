export type PersonType = {
    id: number|null;
    index: string;
    name: string;
    kana: string;
    born: string;
    died: string;
    description: string;
};

export type RelatedPersonType = {
    orderNo: number;
    personId: number;
    personName: string;
    role: string;
    description: string;
}