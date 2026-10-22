import { zodResolver } from "@hookform/resolvers/zod";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ChipRadioGroup from "@/components/property-detail/chip-radio-group";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { firstName, type Agent } from "@/data/agents";
import { agentDetailPage } from "@/data/pages";
import { addMessage } from "@/store/messages";

const copy = agentDetailPage.form;
const PHONE_DIGITS = 10;
type AgentInterest = keyof typeof copy.interests;
const INTERESTS: AgentInterest[] = ["buying", "selling", "renting"];

const schema = z.object({
  interest: z.enum(["buying", "selling", "renting"], {
    error: copy.errors.interest,
  }),
  name: z.string().trim().min(2, copy.errors.name),
  email: z.email(copy.errors.email),
  phone: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" || value.replace(/\D/g, "").length >= PHONE_DIGITS,
      copy.errors.phone,
    ),
  message: z.string().trim().min(1, copy.errors.message),
});

type Values = z.infer<typeof schema>;

// Short contact form on an agent's profile. Saved to the messages store.
function AgentContactForm({ agent, id }: { agent: Agent; id: string }) {
  const headingId = useId();
  const fieldId = useId();
  const [sent, setSent] = useState(false);
  const name = firstName(agent);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  function onSubmit(values: Values) {
    addMessage({
      type: "agent-contact",
      agentId: agent.id,
      subject: copy.subject(copy.interests[values.interest], agent.name),
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      message: values.message,
    });
    setSent(true);
  }

  const ids = {
    name: `${fieldId}-name`,
    email: `${fieldId}-email`,
    phone: `${fieldId}-phone`,
    message: `${fieldId}-message`,
  };

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-6 rounded-xl border border-border p-5"
    >
      <h2 id={headingId} className="type-title">
        {copy.heading(name)}
      </h2>

      <div className="mt-5">
        {sent ? (
          <div role="status" className="flex flex-col items-start gap-3">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-primary"
            />
            <p className="text-muted-foreground">{copy.success(name)}</p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <ChipRadioGroup
                legend={copy.interest}
                columns="fill"
                options={INTERESTS.map((value) => ({
                  value,
                  label: copy.interests[value],
                }))}
                registration={register("interest")}
                error={errors.interest?.message}
              />
              <Field data-invalid={errors.name ? true : undefined}>
                <FieldLabel htmlFor={ids.name}>{copy.name}</FieldLabel>
                <Input
                  id={ids.name}
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field data-invalid={errors.email ? true : undefined}>
                <FieldLabel htmlFor={ids.email}>{copy.email}</FieldLabel>
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
                  {copy.phone}
                  <span className="font-normal text-muted-foreground">
                    {copy.optional}
                  </span>
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
              <Field data-invalid={errors.message ? true : undefined}>
                <FieldLabel htmlFor={ids.message}>{copy.message}</FieldLabel>
                <Textarea
                  id={ids.message}
                  rows={4}
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
    </section>
  );
}

export default AgentContactForm;
