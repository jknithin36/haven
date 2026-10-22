import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { DURATION, EASE } from "@/lib/motion";

function format(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Counts from 0 to `value` once when scrolled into view. Screen readers get
// the final number; the counting copy is visual only.
function CountUp({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const final = format(value, decimals);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduceMotion) return;
    // Update the text directly so counting doesn't re-render React each frame.
    const controls = animate(0, value, {
      duration: DURATION.count,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(v, decimals);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, decimals]);

  return (
    <>
      <span className="sr-only select-none">
        {final}
        {suffix}
      </span>
      <span aria-hidden="true">
        <span ref={ref}>{reduceMotion ? final : format(0, decimals)}</span>
        {suffix}
      </span>
    </>
  );
}

export default CountUp;
