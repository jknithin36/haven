import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarAdd01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useMemo, useState } from "react";
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
import type { Agent } from "@/data/agents";
import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatChipDate, formatLongDate, upcomingTourDays } from "@/lib/dates";
import { downloadIcs } from "@/lib/ics";
import { addTourRequest, type TourRequest } from "@/store/requests";

const copy = propertyDetailPage.tour;
const PHONE_DIGITS = 10;
const MESSAGE_MAX = 500;

const schema = z.object({
  type: z.enum(["in-person", "video"]),
  date: z.string({ error: copy.errors.date }).min(1, copy.errors.date),
  time: z.string({ error: copy.errors.time }).min(1, copy.errors.time),
  name: z.string().trim().min(2, copy.errors.name),
  email: z.email(copy.errors.email),
  phone: z
    .string()
    .refine(
      (value) => value.replace(/\D/g, "").length >= PHONE_DIGITS,
      copy.errors.phone,
    ),
  message: z.string().max(MESSAGE_MAX, copy.errors.message).optional(),
});

type TourValues = z.infer<typeof schema>;

function Confirmation({
  request,
  property,
  agent,
}: {
  request: TourRequest;
  property: Property;
  agent: Agent;
}) {
  const firstName = agent.name.split(" ")[0];

  function addToCalendar() {
    downloadIcs({
      title: copy.calendarTitle(property.name),
      description: copy.calendarDescription(agent.name),
      location: `${property.address}, ${property.city}, ${property.state} ${property.zip}`,
      date: request.date,
      time: request.time,
      fileName: `haven-tour-${property.slug}.ics`,
    });
  }

  return (
    <div role="status" className="flex flex-col items-start gap-4">
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={32}
        strokeWidth={1.5}
        aria-hidden="true"
        className="text-primary"
      />
      <p className="type-title">{copy.successTitle}</p>
      <p className="text-muted-foreground">
        {copy.success(firstName, formatLongDate(request.date), request.time)}
      </p>
      <Button variant="outline" size="lg" onClick={addToCalendar}>
        <HugeiconsIcon
          icon={CalendarAdd01Icon}
          strokeWidth={1.5}
          aria-hidden="true"
          data-icon="inline-start"
        />
        {copy.addToCalendar}
      </Button>
    </div>
  );
}

// The tour form body. The dialog around it provides the heading.
function TourForm({ property, agent }: { property: Property; agent: Agent }) {
  const fieldId = useId();
  const [submitted, setSubmitted] = useState<TourRequest | null>(null);
  const days = useMemo(() => upcomingTourDays(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TourValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "in-person", message: "" },
  });

  function onSubmit(values: TourValues) {
    const saved = addTourRequest({
      propertyId: property.id,
      propertySlug: property.slug,
      agentId: agent.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      date: values.date,
      time: values.time,
      type: values.type,
      message: values.message || undefined,
    });
    setSubmitted(saved);
  }

  const ids = {
    name: `${fieldId}-name`,
    email: `${fieldId}-email`,
    phone: `${fieldId}-phone`,
    message: `${fieldId}-message`,
  };

  return (
    <>
      <div>
        {submitted ? (
          <Confirmation request={submitted} property={property} agent={agent} />
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <ChipRadioGroup
                legend={copy.type}
                columns="fill"
                options={[
                  { value: "in-person", label: copy.types["in-person"] },
                  { value: "video", label: copy.types.video },
                ]}
                registration={register("type")}
              />
              <ChipRadioGroup
                legend={copy.date}
                options={days.map((day) => ({
                  value: day,
                  label: formatChipDate(day),
                }))}
                registration={register("date")}
                error={errors.date?.message}
              />
              <ChipRadioGroup
                legend={copy.time}
                options={copy.times.map((time) => ({
                  value: time,
                  label: time,
                }))}
                registration={register("time")}
                error={errors.time?.message}
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
                <FieldLabel htmlFor={ids.phone}>{copy.phone}</FieldLabel>
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
                <FieldLabel htmlFor={ids.message}>
                  {copy.message}
                  <span className="font-normal text-muted-foreground">
                    {copy.optional}
                  </span>
                </FieldLabel>
                <Textarea
                  id={ids.message}
                  rows={3}
                  placeholder={copy.messagePlaceholder}
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

      <p className="text-sm text-muted-foreground">{copy.note}</p>
    </>
  );
}

export default TourForm;
