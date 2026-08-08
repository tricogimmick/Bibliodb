export type BrandType = {
    id: number | null;
    name: string;
    description: string;
}

export function createBrandType(id: number | null = null, name: string = '', description: string = ''): BrandType {
    return {
        id,
        name,
        description
    };
}