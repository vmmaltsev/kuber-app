import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    return (
        <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${nextTheme} theme`}
            onClick={toggleTheme}
        >
            <span aria-hidden="true" style={{ fontSize: '1.5rem' }}>
                {theme === 'light' ? '🌙' : '☀️'}
            </span>
        </button>
    );
};
