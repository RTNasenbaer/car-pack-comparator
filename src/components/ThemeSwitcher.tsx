import { useAppContext } from '../context/AppContext.tsx';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useAppContext();

  return (
    <div>
      <label htmlFor="theme-switcher">Theme</label>
      <select id="theme-switcher" value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
