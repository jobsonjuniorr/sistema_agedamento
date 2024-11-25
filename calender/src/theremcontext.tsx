import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Buscando a preferência salva no localStorage
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme ? savedTheme === 'dark' : false;

  const [isDarkMode, setIsDarkMode] = useState(initialTheme);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      // Salvando a preferência do tema no localStorage
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  useEffect(() => {
    // Alterando a classe do body com base no estado do tema
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
