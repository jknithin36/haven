import { Outlet } from "react-router";

import ScrollToTop from "@/components/scroll-to-top";
import AnnouncementBar from "@/components/site/announcement-bar";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { site } from "@/data/site";

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {/* First Tab stop: jump past the navigation */}
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {site.skipLink}
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MarketingLayout;
