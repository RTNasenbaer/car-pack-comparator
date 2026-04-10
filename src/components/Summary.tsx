import type { ComparisonData } from '../data/types';
import { useTranslation } from 'react-i18next';

interface SummaryProps {
    data: ComparisonData;
}

const Summary = ({ data }: SummaryProps) => {
    const { t } = useTranslation();
    return (
        <section className="grid" id="summary">
            {data.packs.map(pack => {
                const categoryCount = Object.keys(pack.categories).length;
                const featureCount = Object.values(pack.categories)
                    .reduce((sum, features) => sum + features.length, 0);

                const duplicateCountByCategory = Object.values(pack.duplicateFeatures)
                    .reduce((sum, entries) => sum + entries.length, 0);
                const duplicateCountGlobal = pack.duplicateFeaturesGlobal.length;

                return (
                    <article key={pack.name} className="card">
                        <h3>{pack.name}</h3>
                        <p className="meta">
                            {t('summary_file')}: {pack.fileName} | {t('summary_categories')}: {categoryCount} | {t('summary_features')}: {featureCount} |
                            {t('summary_category_duplicates')}: {duplicateCountByCategory} | {t('summary_cross_category_duplicates')}: {duplicateCountGlobal}
                        </p>
                    </article>
                );
            })}
        </section>
    );
};

export default Summary;
