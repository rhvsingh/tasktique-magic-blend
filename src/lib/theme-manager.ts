
// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Local storage key
const THEME_KEY = 'tasktique-theme';

// Get the user's preferred theme from local storage or default to system
export const getStoredTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return (storedTheme as Theme) || 'system';
};

// Set the theme in local storage and apply it to the document
export const setTheme = (theme: Theme): void => {
  // Store the theme preference
  localStorage.setItem(THEME_KEY, theme);
  
  // Apply the theme to the document
  applyTheme(theme);
};

// Apply the theme to the document
export const applyTheme = (theme: Theme): void => {
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  document.documentElement.classList.toggle('dark', isDark);
};

// Initialize theme on page load
export const initializeTheme = (): void => {
  const theme = getStoredTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  if (theme === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      applyTheme('system');
    });
  }
};
