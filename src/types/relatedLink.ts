export type RelatedLinkType = {
    id: number | null;
    relatedType: string;
    relatedId: number | null;
    linkType: "IMG" | "LINK";
    url: string;
    alt: string;
    description: string;
};