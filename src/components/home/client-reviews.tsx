import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "motion/react";
import { useEffect, useId, useState, type KeyboardEvent } from "react";

import CountUp from "@/components/count-up";
import ReviewQuote from "@/components/review-quote";
import SectionHeader from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { reviews, reviewsSection as copy, reviewStats } from "@/data/reviews";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;
const SWIPE_PX = 60;

// `custom` is the direction (1 = next, -1 = previous), so the old review
// leaves the way the new one came from.
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 20 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -20 * dir }),
};

function Controls({
  index,
  onPrev,
  onNext,
  className,
}: {
  index: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full"
        onClick={onPrev}
        aria-label={copy.previous}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Button>
      <p
        className="min-w-12 text-center text-sm tabular-nums"
        aria-hidden="true"
      >
        {index + 1} / {reviews.length}
      </p>
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full"
        onClick={onNext}
        aria-label={copy.next}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

function ClientReviews() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const review = reviews[index];
  const autoplay = !reduceMotion && !paused;

  function go(step: number) {
    setDirection(step);
    setIndex((i) => (i + step + reviews.length) % reviews.length);
  }

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_PX) go(1);
    else if (info.offset.x > SWIPE_PX) go(-1);
  }

  const duration = reduceMotion ? 0 : DURATION.fast;

  return (
    <section
      id="reviews"
      aria-labelledby={headingId}
      className="section-y scroll-mt-6"
    >
      <div className="page-container">
        <SectionHeader
          id={headingId}
          label={copy.label}
          heading={copy.heading}
          action={
            <Controls
              index={index}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              className="hidden md:flex"
            />
          }
        />

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.carouselLabel}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="mt-10 rounded-2xl focus-ring"
        >
          <motion.div
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            aria-live={autoplay ? "off" : "polite"}
            aria-roledescription="slide"
            aria-label={copy.slideLabel(index + 1, reviews.length)}
            className="grid cursor-grab items-center gap-8 active:cursor-grabbing md:grid-cols-[7fr_5fr] md:gap-14"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-5/6">
              <AnimatePresence initial={false}>
                <motion.img
                  key={review.id}
                  src={review.photo}
                  alt={review.photoAlt}
                  loading="lazy"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.figure
                key={review.id}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration, ease: EASE }}
              >
                <ReviewQuote review={review} />
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        </div>

        <Controls
          index={index}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          className="mt-10 justify-center md:hidden"
        />

        <dl className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-3">
          {reviewStats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="type-stat">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default ClientReviews;
