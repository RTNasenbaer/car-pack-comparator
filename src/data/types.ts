export interface Pack {
    fileName: string;
    name: string;
    categories: {
        [key: string]: string[];
    };
    categoryOrder: string[];
    duplicateFeatures: any;
    duplicateFeaturesGlobal: {
        feature: string;
        count: number;
        categories: string[];
    }[];
    emptyCategories: string[];
}

export interface ComparisonData {
    generatedAt: string;
    packs: Pack[];
    categoryOrder: string[];
    warnings: string[];
}
