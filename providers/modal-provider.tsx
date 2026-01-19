import React, { createContext, ReactNode, useContext, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type ModalContextType = {
  open: (content: ReactNode) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function FullScreenModalProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<ReactNode>(null);

  const open = (node: ReactNode) => {
    setContent(node);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="slide" // 👈 Native slide animation
        onRequestClose={close} // Android back button
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} />

          <View style={styles.content}>{content}</View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
}

/* ---------- Hook ---------- */
export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used inside FullScreenModalProvider");
  }
  return context;
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
