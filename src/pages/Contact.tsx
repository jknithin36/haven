import { zodResolver } from "@hookform/resolvers/zod";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactPage as copy } from "@/data/pages";
import { useAgents } from "@/store/agents";
import { addMessage, type MessageType } from "@/store/messages";

const PHONE_DIGITS = 10;
const MESSAGE_MAX = 1000;

const schema = z.object({
  name: z.string().trim().min(2, copy.errors.name),
  email: z.email(copy.errors.email),
  phone: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" || value.replace(/\D/g, "").length >= PHONE_DIGITS,
      copy.errors.phone,
    ),
  address: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(1, copy.errors.message)
    .max(MESSAGE_MAX, copy.errors.messageTooLong),
});

type ContactValues = z.infer<typeof schema>;

const EMPTY: ContactValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  message: "",
};

function Optional() {
  return (
    <span className="font-normal text-muted-foreground">
      {copy.fields.optional}
    </span>
  );
}

function Contact() {
  const headingId = useId();
  const fieldId = useId();
  const [sentName, setSentName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  // No backend yet: the form validates and confirms on screen only.
  // Links like /contact?type=tour or ?agent=emma-lawson&area=clearwater tell
  // the dashboard what the message is about.
  const [searchParams] = useSearchParams();
  const agents = useAgents();
  const agent = agents.find((a) => a.slug === searchParams.get("agent"));
  const typeParam = searchParams.get("type");
  const messageType: MessageType =
    typeParam === "tour" || typeParam === "agent-match"
      ? typeParam
      : agent
        ? "agent-contact"
        : "general";

  function onSubmit(values: ContactValues) {
    addMessage({
      type: messageType,
      agentId: agent?.id,
      area: searchParams.get("area") ?? undefined,
      subject: copy.subject(values.message),
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      message: values.message,
    });
    setSentName(values.name.split(" ")[0]);
    reset(EMPTY);
  }

  const ids = {
    name: `${fieldId}-name`,
    email: `${fieldId}-email`,
    phone: `${fieldId}-phone`,
    address: `${fieldId}-address`,
    message: `${fieldId}-message`,
  };

  return (
    <>
      <PageMeta title={copy.meta.title} description={copy.meta.description} />

      <section aria-labelledby={headingId} className="page-container section-y">
        <div className="mx-auto max-w-xl">
          <div className="flex flex-col items-center text-center">
            <h1 id={headingId} className="type-display">
              {copy.heading}
            </h1>
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              {copy.subtext}
            </p>
          </div>

          <div className="mt-10">
            {sentName ? (
              <div
                role="status"
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={40}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-primary"
                />
                <p className="type-title">{copy.success.title}</p>
                <p className="text-muted-foreground">
                  {copy.success.text(sentName)}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSentName(null)}
                >
                  {copy.success.again}
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="gap-5">
                  <Field data-invalid={errors.name ? true : undefined}>
                    <FieldLabel htmlFor={ids.name}>
                      {copy.fields.name}
                    </FieldLabel>
                    <Input
                      id={ids.name}
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      {...register("name")}
                    />
                    <FieldError errors={[errors.name]} />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field data-invalid={errors.email ? true : undefined}>
                      <FieldLabel htmlFor={ids.email}>
                        {copy.fields.email}
                      </FieldLabel>
                      <Input
                        id={ids.email}
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors.email ? true : undefined}
                        {...register("email")}
                      />
                      <FieldError errors={[errors.email]} />
                    </Field>
                    <Field data-invalid={errors.phone ? true : undefined}>
                      <FieldLabel htmlFor={ids.phone}>
                        {copy.fields.phone}
                        <Optional />
                      </FieldLabel>
                      <Input
                        id={ids.phone}
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={errors.phone ? true : undefined}
                        {...register("phone")}
                      />
                      <FieldError errors={[errors.phone]} />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor={ids.address}>
                      {copy.fields.address}
                      <Optional />
                    </FieldLabel>
                    <Input
                      id={ids.address}
                      autoComplete="street-address"
                      placeholder={copy.fields.addressPlaceholder}
                      {...register("address")}
                    />
                  </Field>

                  <Field data-invalid={errors.message ? true : undefined}>
                    <FieldLabel htmlFor={ids.message}>
                      {copy.fields.message}
                    </FieldLabel>
                    <Textarea
                      id={ids.message}
                      rows={5}
                      placeholder={copy.fields.messagePlaceholder}
                      aria-invalid={errors.message ? true : undefined}
                      {...register("message")}
                    />
                    <FieldError errors={[errors.message]} />
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {copy.submit}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
