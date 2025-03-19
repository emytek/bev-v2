import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { registerSW, subscribeToPushNotifications } from './utils/registerServiceWorker.ts';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/reactQueryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

registerSW(); 

