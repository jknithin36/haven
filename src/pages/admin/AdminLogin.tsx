import {
  Alert02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";

import BrandLogo from "@/components/brand-logo";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { adminLoginPage as copy } from "@/data/admin";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/demo-auth";
import { DURATION, EASE } from "@/lib/motion";
import { signIn, useAuthUser } from "@/store/auth";

// A short pause so signing in feels real (there's no server).
const SIGN_IN_DELAY_MS = 600;
type FieldErrors = { email?: string; password?: string };

function AdminLogin() {
  const fieldId = useId();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");
  const redirectTo = redirect?.startsWith("/admin") ? redirect : "/admin";

  // Already signed in: skip the form. (After all hooks, never before.)
  const reduceMotion = useReducedMotion();
  const user = useAuthUser();
  if (user) return <Navigate to={redirectTo} replace />;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: FieldErrors = {
      email: email.trim() ? undefined : copy.errors.email,
      password: password ? undefined : copy.errors.password,
    };

    setErrors(next);
    if (next.email || next.password) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const ok = signIn(email, password);
      setSubmitting(false);
      if (ok) navigate(redirectTo, { replace: true });
      else setFailed(true);
    }, SIGN_IN_DELAY_MS);
  }

  function restoreDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    setFailed(false);
  }

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />

      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="w-full max-w-105"
        >
          <BrandLogo className="focus-ring" />

          <h1 className="mt-10 type-heading">{copy.heading}</h1>
          <p className="mt-2 text-muted-foreground">{copy.subtext}</p>

          <form noValidate onSubmit={handleSubmit} className="mt-8">
            <FieldGroup className="gap-5">
              <Field data-invalid={errors.email ? true : undefined}>
                <FieldLabel htmlFor={`${fieldId}-email`}>
                  {copy.email}
                </FieldLabel>
                <Input
                  id={`${fieldId}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  aria-invalid={errors.email ? true : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                    setFailed(false);
                  }}
                  className="h-11"
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>
              <Field data-invalid={errors.password ? true : undefined}>
                <FieldLabel htmlFor={`${fieldId}-password`}>
                  {copy.password}
                </FieldLabel>
                <InputGroup className="h-11">
                  <InputGroupInput
                    id={`${fieldId}-password`}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    aria-invalid={errors.password ? true : undefined}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                      setFailed(false);
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      onClick={() => setShowPassword((shown) => !shown)}
                      aria-label={
                        showPassword ? copy.hidePassword : copy.showPassword
                      }
                      aria-pressed={showPassword}
                    >
                      <HugeiconsIcon
                        icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </Field>
              <AnimatePresence initial={false}>
                {failed && (
                  <motion.div
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-lg bg-muted p-4 text-sm"
                    >
                      <HugeiconsIcon
                        icon={Alert02Icon}
                        size={18}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                      />
                      <div>
                        <p>{copy.errors.incorrect}</p>
                        <button
                          type="button"
                          onClick={restoreDemo}
                          className="mt-2 rounded-sm font-medium underline underline-offset-4 focus-ring"
                        >
                          {copy.restore}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full"
                disabled={submitting}
              >
                {submitting && <Spinner data-icon="inline-start" />}
                {submitting ? copy.submitting : copy.submit}
              </Button>
            </FieldGroup>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {copy.note}
          </p>
        </motion.div>
      </main>
    </>
  );
}

export default AdminLogin;
