"use client";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, useMemo, useState } from "react";

interface ModalProviderProps {
  children?: React.ReactNode;
}

interface ModalConfiguration {
  title: string;
  content: JSX.Element;
}

interface ModalContext {
  open: (configuration: ModalConfiguration) => void;
}

const ModalContext = createContext<ModalContext>({
  open: (_) => {},
});

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(<></>);
  const value = useMemo<ModalContext>(
    () => ({
      open: (configuration) => {
        setTitle(configuration.title);
        setContent(configuration.content);
        open();
      },
    }),
    [open]
  );
  return (
    <ModalContext.Provider value={value}>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        transitionProps={{ transition: "slide-down" }}
      >
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export default ModalProvider;
