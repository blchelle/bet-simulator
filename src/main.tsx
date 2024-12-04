import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { ModalsProvider } from "@mantine/modals";

const Root: React.FC = () => {
  return (
    <MantineProvider defaultColorScheme="light">
      <ModalsProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ModalsProvider>
    </MantineProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
