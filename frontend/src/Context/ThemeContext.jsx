import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const themeLocal = localStorage.getItem("theme");
    if (themeLocal != null) {
      setTheme(JSON.parse(themeLocal));
    } else {
      setTheme("#f4f3f3");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
