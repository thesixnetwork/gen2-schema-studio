import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";
// import buttonTheme from "./button";
// import cardTheme from "./card";
// import badgeTheme from "./badge";
// import tabsTheme from "./tabs";
// import tableTheme from "./table";

const theme = extendTheme({
  // components: {
  //   Button: buttonTheme,
  //   Card: cardTheme,
  //   Badge: badgeTheme,
  //   Tabs: tabsTheme,
  //   Table: tableTheme,
  // },
  colors: {
    primary: {
      50: "#F2F2F2",
      500: "#3864E7",
      900: "#0A1F3D",
    },
    secondary: {
      50: "#F2F2F2",
      500: "#6856B9",
      900: "#0A1F3D",
    },
    darkest: "#141933",
    dark: "#505673",
    medium: "#878CA8",
    light: "#DADEF2",
    lightest: "#F5F6FA",
    error: "#BD4033",
    warning: "#C9762B",
    success: "#39D477",
  },
});

export default theme;
