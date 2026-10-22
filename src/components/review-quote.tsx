import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { reviewsSection as copy, type Review } from "@/data/reviews";

// Stars, quote, and name for one review. Render inside a <figure>.
function ReviewQuote({ review }: { review: Review }) {
  return (
    <>
      <div className="flex gap-1">
        {Array.from({ length: review.rating }, (_, i) => (
          <HugeiconsIcon
            key={i}
            icon={StarIcon}
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="fill-current"
          />
        ))}
        <span className="sr-only">{copy.rating(review.rating)}</span>
      </div>
      <blockquote className="mt-6 type-quote">
        <p>“{review.quote}”</p>
      </blockquote>
      <figcaption className="mt-8">
        <p className="type-title">{review.name}</p>
        <p className="text-sm text-muted-foreground">{copy.meta(review)}</p>
      </figcaption>
    </>
  );
}

export default ReviewQuote;
