import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { neighborhoodDetailPage } from "@/data/pages";

const copy = neighborhoodDetailPage.alerts;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Empty state for an area with no listings: sign up for new-home emails.
// No network call; it only confirms on screen.
function AlertSignup() {
  const inputId = useId();
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
    <div className="rounded-2xl bg-muted px-6 py-12 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background">
        <HugeiconsIcon
          icon={Notification01Icon}
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
      <p className="mt-5 type-title">{copy.title}</p>
      <p className="mt-2 text-muted-foreground">{copy.text}</p>

      {done ? (
        <p role="status" className="mt-6 font-medium">
          {copy.success}
        </p>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
        >
          <Field data-invalid={error ? true : undefined} className="flex-1">
            <FieldLabel htmlFor={inputId} className="sr-only">
              {copy.label}
            </FieldLabel>
            <Input
              id={inputId}
              type="email"
              autoComplete="email"
              placeholder={copy.placeholder}
              value={email}
              aria-invalid={error ? true : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(false);
              }}
              className="h-10 bg-background"
            />
            {error && <FieldError>{copy.error}</FieldError>}
          </Field>
          <Button type="submit" size="lg">
            {copy.button}
          </Button>
        </form>
      )}
    </div>
  );
}

export default AlertSignup;
