import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router";

import BrandLogo from "@/components/brand-logo";
import ButtonLink from "@/components/button-link";
import { Button } from "@/components/ui/button";
import TourIcon from "@/components/tour-icon";
import {
  cta,
  footerBottom,
  footerColumns,
  newsletter,
  type FooterLink,
} from "@/data/footer";
import { site } from "@/data/site";
import { DURATION, EASE, IN_VIEW, revealOnView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// White focus ring for links and buttons on the black footer.
const footerFocus =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground";

// Router links for app pages; plain anchors for hashes and placeholders,
// which React Router doesn't scroll to.
function SmartLink({
  link,
  className,
}: {
  link: FooterLink;
  className: string;
}) {
  if (link.href.includes("#")) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function CtaBanner() {
  const reduceMotion = useReducedMotion();

  const imageMotion: MotionProps = reduceMotion
    ? {}
    : {
        initial: { scale: 1.05 },
        whileInView: { scale: 1 },
        viewport: IN_VIEW,
        transition: { duration: DURATION.slow, ease: EASE },
      };

  return (
    // Split background: top half matches the page, bottom half the footer,
    // so the banner looks like it overlaps both.
    <div className="bg-[linear-gradient(to_bottom,var(--background)_50%,var(--foreground)_50%)]">
      <div className="page-container">
        <div className="relative h-95 overflow-hidden rounded-2xl bg-muted md:h-130">
          <motion.img
            {...imageMotion}
            src={cta.image}
            alt={cta.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/45 to-black/25" />
          <motion.div
            {...revealOnView(reduceMotion, 0.15)}
            className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white"
          >
            <h2 className="type-heading">{cta.heading}</h2>
            <p className="mt-4 max-w-measure text-lg text-pretty text-white/85">
              {cta.text}
            </p>
            <ButtonLink to={cta.button.href} className="mt-8 w-full md:w-auto">
              <TourIcon />
              {cta.button.label}
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Newsletter() {
  const inputId = useId();
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(true);
      return;
    }
    setDone(true);
  }

  return (
    <div className="col-span-2 md:col-span-1">
      <h2 className="type-title">{newsletter.title}</h2>
      {done ? (
        <p role="status" className="mt-5 text-background/80">
          {newsletter.success}
        </p>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-5">
          <label htmlFor={inputId} className="sr-only">
            {newsletter.label}
          </label>
          <div className="flex gap-3">
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(false);
              }}
              placeholder={newsletter.placeholder}
              aria-invalid={error}
              aria-describedby={error ? errorId : undefined}
              className="h-10 min-w-0 flex-1 border-b border-background/30 bg-transparent text-background outline-none transition-colors placeholder:text-background/40 focus:border-background aria-invalid:border-destructive"
            />
            <Button
              type="submit"
              size="lg"
              className="focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              {newsletter.button}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                strokeWidth={1.5}
                aria-hidden="true"
                data-icon="inline-end"
              />
            </Button>
          </div>
          {error && (
            <p id={errorId} className="dark mt-2 text-sm text-destructive">
              {newsletter.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function Footer() {
  return (
    <>
      <CtaBanner />
      <footer className="bg-foreground text-background">
        <div className="page-container pt-20 pb-10">
          <BrandLogo className={footerFocus} />
          <p className="mt-3 text-background/60">{site.tagline}</p>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1fr_1fr_1fr_1.6fr]">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="type-eyebrow font-medium">{column.title}</h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <SmartLink
                        link={link}
                        className={cn(
                          "text-background/60 transition-colors hover:text-background",
                          footerFocus,
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <Newsletter />
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-background/10 pt-8 text-sm text-background/50 md:flex-row md:items-center md:justify-between">
            <p>{footerBottom.copyright}</p>
            <p>{footerBottom.contact}</p>
            <nav aria-label={footerBottom.socialLabel}>
              <ul className="flex gap-6">
                {footerBottom.social.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      link={link}
                      className={cn(
                        "transition-colors hover:text-background",
                        footerFocus,
                      )}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="mt-4 text-xs text-background/40">
            {footerBottom.disclaimer}
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
