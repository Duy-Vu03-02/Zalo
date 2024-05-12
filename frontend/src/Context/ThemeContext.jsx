import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  // useEffect(() => {
  //   const themeLocal = localStorage.getItem("theme");
  //   if (themeLocal != null) {
  //     setTheme(JSON.parse(themeLocal));
  //   } else {
  //     setTheme("#f4f3f3");
  //     handleChangeTheme("#f4f3f3");
  //   }
  // }, []);
  console.log("e");

  const handleChangeTheme = (value) => {
    setTheme(value);
    localStorage.setItem("theme", JSON.stringify(value));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, handleChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
