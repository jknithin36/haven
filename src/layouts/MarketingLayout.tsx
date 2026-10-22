import { Outlet } from "react-router";

import ScrollToTop from "@/components/scroll-to-top";
import AnnouncementBar from "@/components/site/announcement-bar";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MarketingLayout;
