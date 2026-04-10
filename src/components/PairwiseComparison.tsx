import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComparisonData, Pack } from '../data/types';

interface PairwiseComparisonProps {
    data: ComparisonData;
}

const byName = (packs: Pack[], name: string): Pack | undefined => packs.find((p) => p.name === name);

const setFromCategory = (pack: Pack, categoryName: string): Set<string> => {
    const values = (pack.categories[categoryName] || []).map(f => f.name).slice();
    return new Set(values);
};

const toSortedArray = (setObj: Set<string>): string[] => {
    return Array.from(setObj).sort((a, b) => a.localeCompare(b));
};

const buildListOrEmpty = (items: string[], t: (key: string) => string) => {
    if (!items.length) {
        return <p className="empty">{t('pairwise_none')}</p>;
    }

    return (
        <ul>
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    );
};

const PairwiseComparison = ({ data }: PairwiseComparisonProps) => {
    const { t } = useTranslation();
    const [leftPackName, setLeftPackName] = useState<string | undefined>(undefined);
    const [rightPackName, setRightPackName] = useState<string | undefined>(undefined);
    const [onlyDiff, setOnlyDiff] = useState(true);

    const currentLeftPackName = leftPackName ?? data.packs[0]?.name;
    const currentRightPackName = rightPackName ?? data.packs[1]?.name;

    const leftPack = useMemo(() => byName(data.packs, currentLeftPackName), [data.packs, currentLeftPackName]);
    const rightPack = useMemo(() => byName(data.packs, currentRightPackName), [data.packs, currentRightPackName]);

    const pairwiseContent = useMemo(() => {
        if (!leftPack || !rightPack) return null;

        return data.categoryOrder.map((categoryName) => {
            const leftSet = setFromCategory(leftPack, categoryName);
            const rightSet = setFromCategory(rightPack, categoryName);

            const onlyLeft = toSortedArray(
                new Set([...leftSet].filter((item) => !rightSet.has(item)))
            );
            const onlyRight = toSortedArray(
                new Set([...rightSet].filter((item) => !leftSet.has(item)))
            );
            const common = toSortedArray(
                new Set([...leftSet].filter((item) => rightSet.has(item)))
            );

            if (onlyDiff && !onlyLeft.length && !onlyRight.length) {
                return null;
            }

            return (
                <section key={categoryName} className="category-block">
                    <div className="category-header">
                        {categoryName}
                        <span>
                            {t('pairwise_only_left')}: {onlyLeft.length} | {t('pairwise_only_right')}: {onlyRight.length} | {t('pairwise_common')}: {common.length}
                        </span>
                    </div>
                    <div className="diff-columns">
                        <div className="diff-col">
                            <h4>{t('pairwise_only_in')} {leftPack.name}</h4>
                            {buildListOrEmpty(onlyLeft, t)}
                        </div>
                        <div className="diff-col">
                            <h4>{t('pairwise_only_in')} {rightPack.name}</h4>
                            {buildListOrEmpty(onlyRight, t)}
                        </div>
                    </div>
                    {!onlyDiff && (
                        <div className="diff-col" style={{ margin: '0 12px 12px' }}>
                            <h4>{t('pairwise_common_entries')}</h4>
                            {buildListOrEmpty(common, t)}
                        </div>
                    )}
                </section>
            );
        }).filter(Boolean);
    }, [leftPack, rightPack, data.categoryOrder, onlyDiff, t]);

    return (
        <section className="panel">
            <h2>{t('pairwise_compare')}</h2>
            <div className="controls">
                <label>
                    {t('pairwise_base_pack')}
                    <select value={currentLeftPackName} onChange={(e) => setLeftPackName(e.target.value)}>
                        {data.packs.map(pack => <option key={pack.name} value={pack.name}>{pack.name}</option>)}
                    </select>
                </label>
                <label>
                    {t('pairwise_compare_with')}
                    <select value={currentRightPackName} onChange={(e) => setRightPackName(e.target.value)}>
                        {data.packs.map(pack => <option key={pack.name} value={pack.name}>{pack.name}</option>)}
                    </select>
                </label>
                <label className="check-row">
                    <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />
                    {t('show_only_differences')}
                </label>
            </div>
            <div id="pairwise">
                {pairwiseContent && pairwiseContent.length > 0 ? pairwiseContent : <p className="hint">{t('pairwise_no_differences')}</p>}
            </div>
        </section>
    );
};

export default PairwiseComparison;
