// context/SnackbarContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Snackbar, Text, useTheme } from "react-native-paper";

interface SnackbarContextData {
  showSnackbar: (message: string) => void;
  hideSnackbar: () => void;
  isVisible: boolean;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar, hideSnackbar, isVisible: visible }}
    >
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: hideSnackbar,
        }}
        style={{
          backgroundColor: theme.colors.surface,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: theme.colors.onSurface }}>{message}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextData => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
