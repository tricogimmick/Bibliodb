export type PublisherType = {
    id: number|null;
    name: string;
    description: string;
};

export function createPublisherType(id: number | null = null, name: string = '', description: string = ''): PublisherType {
    return {
        id,
        name,
        description
    };
}