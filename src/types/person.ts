import type { RelatedLinkType } from "./relatedLink";

export type PersonType = {
    id: number | null;
    index: string;
    name: string;
    kana: string;
    born: string;
    died: string;
    description: string;
    // ここから下は関連情報
    relatedLinks: RelatedLinkType[] | null;
};

export type RelatedPersonType = {
    orderNo: number;
    personId: number | null;
    personName: string;
    role: string;
    description: string;
}

// 人物情報を作成する
export function createPersonType() {
    return (
        {
            id: null,
            index: "",
            name: "",
            kana: "",
            born: "",
            died: "",
            description: "",
            relatedLinks: []
        }
    )
}