import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

// Start each new page at the top. Filter changes (search params) and hash
// links keep their position.
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
