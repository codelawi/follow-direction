import "@/global.css";
import React from "react";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";

import LoadingPage from "@/components/loading-page";
import { FullScreenModalProvider } from "@/providers/modal-provider";
import { SnackbarProvider } from "@/providers/snackbar-provider";

export default function Layout() {
  const [loaded] = useFonts({
    Regular: require("../assets/fonts/reg.ttf"),
    Light: require("../assets/fonts/light.ttf"),
    ExtraLight: require("../assets/fonts/extralight.ttf"),
    Medium: require("../assets/fonts/med.ttf"),
    Bold: require("../assets/fonts/bold.ttf"),
    SemiBold: require("../assets/fonts/semibold.ttf"),
  });

  if (!loaded) return <LoadingPage />;

  const theme = {
    ...DefaultTheme,
    fonts: {
      ...DefaultTheme.fonts,
      bodyLarge: { fontFamily: "Regular" },
      bodyMedium: { fontFamily: "Regular" },
      titleLarge: { fontFamily: "Bold" },
      titleMedium: { fontFamily: "SemiBold" },
      labelLarge: { fontFamily: "Medium" },
    },
    colors: {
      ...DefaultTheme.colors,
      primary: "#2563eb",
      background: "#ffffff",
      secondary: "#facc15",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <FullScreenModalProvider>
        <SnackbarProvider>
          <Slot />
        </SnackbarProvider>
      </FullScreenModalProvider>
    </PaperProvider>
  );
}
