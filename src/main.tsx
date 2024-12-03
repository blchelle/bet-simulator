import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import React from "react";

const Root: React.FC = () => {
  return (
    <MantineProvider defaultColorScheme="light">
      <StrictMode>
        <App />
      </StrictMode>
    </MantineProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
