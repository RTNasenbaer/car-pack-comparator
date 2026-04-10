export interface PackEntry {
    name: string;
    description: string;
    category: string;
}

export interface Pack {
    fileName: string;
    name: string;
    features: PackEntry[];
    categories: Record<string, PackEntry[]>;
    duplicateFeatures: Record<string, PackEntry[]>;
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
