import { useEffect, useState } from "react";

// How close to the top of the screen (px) a section's top must be to count
// as active. Sections jumped to from a contents link land about 24px down.
const ACTIVE_LINE = 120;

// Returns the id of the section the reader is in, for highlighting the
// matching link in a table of contents. That's the last section whose top
// has scrolled within 120px of the top of the screen, or the first one.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key ? key.split(",") : [];
    if (sectionIds.length === 0) return;
    let frame = 0;

    function update() {
      frame = 0;
      const line = ACTIVE_LINE;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, short last sections can't reach the line, so
      // trust the section the reader jumped to (from a contents link).
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      const hash = window.location.hash.slice(1);
      if (atBottom && sectionIds.includes(hash)) current = hash;
      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [key]);

  return active;
}
