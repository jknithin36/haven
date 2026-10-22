import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

// A data router (rather than <BrowserRouter>) so pages can use useBlocker,
// e.g. to warn before leaving a form with unsaved changes. App keeps its
// <Routes>, so every existing route works as before.
// index.html carries default tags for crawlers that skip JavaScript. Each
// page renders its own with <PageMeta>, so drop the defaults first.
document.querySelectorAll("[data-static-meta]").forEach((el) => el.remove());

const router = createBrowserRouter([{ path: "*", element: <App /> }]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <Toaster>
        <RouterProvider router={router} />
      </Toaster>
    </TooltipProvider>
  </StrictMode>,
);
