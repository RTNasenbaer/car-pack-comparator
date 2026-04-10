import { useMemo } from 'react';
import type { ComparisonData } from '../data/types';
import { useTranslation } from 'react-i18next';

interface MatrixProps {
    data: ComparisonData;
}

const Matrix = ({ data }: MatrixProps) => {
    const { t } = useTranslation();

    const categoryFeatures = useMemo(() => {
        return data.categoryOrder.map(categoryName => {
            const featureSet = new Set<string>();
            data.packs.forEach(pack => {
                (pack.categories[categoryName] || []).forEach(feature => featureSet.add(feature));
            });
            const features = Array.from(featureSet).sort((a, b) => a.localeCompare(b));
            return { categoryName, features };
        });
    }, [data]);

    return (
        <section className="panel">
            <h2>{t('matrix_title')}</h2>
            <p className="hint">{t('matrix_hint')}</p>
            <div id="matrix">
                {categoryFeatures.map(({ categoryName, features }) => {
                    if (!features.length) return null;

                    return (
                        <details key={categoryName} className="matrix-group">
                            <summary>{categoryName} ({features.length} {t('matrix_unique_features')})</summary>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('matrix_feature')}</th>
                                        {data.packs.map(pack => <th key={pack.name}>{pack.name}</th>)}
                                        <th>{t('matrix_coverage')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map(feature => {
                                        const presentCount = data.packs.filter(pack => (pack.categories[categoryName] || []).some(f => f === feature)).length;
                                        return (
                                            <tr key={feature}>
                                                <td>{feature}</td>
                                                {data.packs.map(pack => {
                                                    const inPack = (pack.categories[categoryName] || []).some(f => f === feature);
                                                    return <td key={pack.name} className={`flag ${inPack ? 'yes' : 'no'}`}>{inPack ? 'x' : '-'}</td>;
                                                })}
                                                <td>{presentCount} / {data.packs.length}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </details>
                    );
                })}
            </div>
        </section>
    );
};

export default Matrix;
