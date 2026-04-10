import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <label htmlFor="language-switcher">Language</label>
      <select id="language-switcher" value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
