// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// 1) Creamos una instancia de QueryClient (maneja cache, requests, etc.)
const queryClient = new QueryClient();

// 2) Renderizamos la app dentro de:
//    - BrowserRouter: habilita las rutas
//    - QueryClientProvider: habilita React Query en toda la app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
