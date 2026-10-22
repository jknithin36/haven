import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type ImageSource = { src: string; width?: number; height?: number };

// A wide image that starts inset with white space on both sides and grows to
// full width as it scrolls up the page. Place it outside `page-container` so
// it can reach the screen edges.
function ExpandingImage({
  desktop,
  mobile,
  alt,
  className,
}: {
  desktop: ImageSource;
  mobile?: ImageSource;
  alt: string;
  className?: string; // height classes, e.g. "h-[60vh] md:h-[85vh]"
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // 0 → 1 as the image grows from its starting width (--start) to full width.
  // The starting width lives in CSS so it can change per breakpoint.
  const expand = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const width = useTransform(
    expand,
    (v) => `calc(var(--start) + (100% - var(--start)) * ${v})`,
  );

  return (
    <div ref={ref} className="relative w-full">
      <motion.div
        className={cn(
          "relative mx-auto overflow-hidden rounded-xl bg-muted [--start:90%] md:[--start:76%]",
          className,
        )}
        style={reduceMotion ? { width: "100%" } : { width }}
      >
        <picture>
          {mobile && (
            <source
              media="(max-width: 767px)"
              srcSet={mobile.src}
              width={mobile.width}
              height={mobile.height}
            />
          )}
          <img
            src={desktop.src}
            width={desktop.width}
            height={desktop.height}
            alt={alt}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </motion.div>
    </div>
  );
}

export default ExpandingImage;
