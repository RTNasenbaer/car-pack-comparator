import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Summary from './components/Summary';
import PairwiseComparison from './components/PairwiseComparison';
import Matrix from './components/Matrix';
import GuidedTutorial from './components/GuidedTutorial';
import ThemeSwitcher from './components/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useAppContext } from './context/AppContext.tsx';
import './App.css';
import type { ComparisonData } from './data/types';

function App() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { introductionSeen } = useAppContext();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchAndSetData = (lng: string) => {
      setError(null);
      // Use dynamic import to load the JSON data
      import(`./data/data_${lng}.json`)
        .then(module => {
          setData(module.default);
        })
        .catch(error => {
          console.error(`Failed to load data for language: ${lng}`, error);
          setError(t('error_loading_data'));
        });
    };

    fetchAndSetData(i18n.language);

    const handleLanguageChange = (lng: string) => {
      fetchAndSetData(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, t]);

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  if (!data) {
    return <div className="container loading-spinner"></div>;
  }

  return (
    <div className="container">
      {!introductionSeen && <GuidedTutorial />}
      <div className="top-controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <header>
        <h1>{t('header_title')}</h1>
        <p>{t('header_subtitle')}</p>
        <span className="stamp">{t('generated_at')} {data.generatedAt}</span>
      </header>

      <div className="summary-panel">
        <Summary data={data} />
      </div>
      <div className="pairwise-panel">
        <PairwiseComparison key={i18n.language} data={data} />
      </div>
      <div className="matrix-panel">
        <Matrix data={data} />
      </div>

    </div>
  );
}

export default App;
