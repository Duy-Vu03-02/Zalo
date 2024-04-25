import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const themeLocal = localStorage.getItem("theme");
    if (themeLocal != null) {
      setTheme(JSON.parse(themeLocal));
    }
  }, []);

  return (
    <ThemeContext.Provider value={(theme, setTheme)}>
      {children}
    </ThemeContext.Provider>
  );
};
