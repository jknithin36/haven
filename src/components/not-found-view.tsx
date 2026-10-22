import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";

import ButtonLink from "@/components/button-link";
import PageMeta from "@/components/page-meta";
import { notFoundPage as copy } from "@/data/pages";
import { DURATION, EASE, revealOnView } from "@/lib/motion";

// The 404 layout. Detail pages reuse it for unknown homes, neighborhoods, and
// agents with their own heading and text.
function NotFoundView({
  metaTitle = copy.metaTitle,
  heading = copy.heading,
  text = copy.text,
}: {
  metaTitle?: string;
  heading?: string;
  text?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <PageMeta title={metaTitle} noindex />

      <div className="page-container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <HugeiconsIcon
          icon={Home01Icon}
          size={32}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-muted-foreground"
        />
        <motion.p
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          className="mt-4 type-giant text-border"
        >
          {copy.code}
        </motion.p>

        <motion.div
          {...revealOnView(reduceMotion, 0.15)}
          className="flex flex-col items-center"
        >
          <h1 className="mt-6 type-heading">{heading}</h1>
          <p className="mt-4 max-w-measure text-lg text-pretty text-muted-foreground">
            {text}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={copy.home.to}>{copy.home.label}</ButtonLink>
            <ButtonLink to={copy.browse.to} variant="outline">
              {copy.browse.label}
            </ButtonLink>
          </div>

          <nav aria-label={copy.quickLinksLabel} className="mt-10">
            <ul className="flex flex-wrap justify-center gap-x-2 text-sm text-muted-foreground">
              {copy.quickLinks.map((link, i) => (
                <li key={link.to} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <Link
                    to={link.to}
                    className="rounded-sm underline-offset-4 focus-ring hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      </div>
    </>
  );
}

export default NotFoundView;
