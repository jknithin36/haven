import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import MarketingLayout from "@/layouts/MarketingLayout";
import About from "@/pages/About";
import AgentDetail from "@/pages/AgentDetail";
import Agents from "@/pages/Agents";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import GuideDetail from "@/pages/GuideDetail";
import Guides from "@/pages/Guides";
import Home from "@/pages/Home";
import NeighborhoodDetail from "@/pages/NeighborhoodDetail";
import Neighborhoods from "@/pages/Neighborhoods";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Terms from "@/pages/Terms";

// The dashboard is its own chunk, loaded on the first visit to /admin.
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes"));

function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<Home />} />

        <Route path="properties">
          <Route index element={<Properties />} />
          <Route path=":slug" element={<PropertyDetail />} />
        </Route>

        <Route path="neighborhoods">
          <Route index element={<Neighborhoods />} />
          <Route path=":slug" element={<NeighborhoodDetail />} />
        </Route>

        <Route path="guides">
          <Route index element={<Guides />} />
          <Route path=":slug" element={<GuideDetail />} />
        </Route>

        <Route path="agents">
          <Route index element={<Agents />} />
          <Route path=":slug" element={<AgentDetail />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRoutes />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
