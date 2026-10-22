import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  agentPatch,
  agentSchema,
  emptyAgentValues,
  newAgent,
  SHORT_BIO_MAX,
  toAgentValues,
  type AgentFormValues,
} from "@/components/admin/agents/agent-form-model";
import FormField from "@/components/admin/property-editor/form-field";
import TagInput from "@/components/admin/property-editor/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { agentsAdminPage } from "@/data/admin-agents";
import type { Agent } from "@/data/agents";
import { ALL, locationOptions } from "@/data/property-filters";
import { isImageUrl } from "@/lib/image-file";
import { addAgent, updateAgent } from "@/store/agents";

const copy = agentsAdminPage.form;

const CITIES = locationOptions
  .filter((o) => o.value !== ALL)
  .map((o) => o.label);

// Photo, or initials until there is a valid one.
function PhotoPreview({ name, src }: { name: string; src: string }) {
  const [broken, setBroken] = useState<string | null>(null);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const showPhoto = isImageUrl(src) && broken !== src;
  return showPhoto ? (
    <img
      src={src}
      alt=""
      onError={() => setBroken(src)}
      className="size-16 shrink-0 rounded-full bg-muted object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium text-muted-foreground"
    >
      {initials}
    </span>
  );
}

// The agent form. Renders inside the side panel; the panel's footer holds
// the buttons, linked to this form by `formId`.
function AgentForm({
  formId,
  agent,
  agents,
  onSaved,
}: {
  formId: string;
  agent?: Agent;
  agents: Agent[];
  onSaved: (agent: Agent, created: boolean) => void;
}) {
  const id = useId();
  const schema = useMemo(
    () => agentSchema(agents, agent?.id),
    [agents, agent?.id],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AgentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: agent ? toAgentValues(agent) : emptyAgentValues(),
  });
  const [photo, name, shortBio] = useWatch({
    control,
    name: ["photo", "name", "shortBio"],
  });

  function save(values: AgentFormValues) {
    if (agent) {
      updateAgent(agent.id, agentPatch(values, agent));
      onSaved({ ...agent, ...agentPatch(values, agent) }, false);
    } else {
      const created = newAgent(values);
      addAgent(created);
      onSaved(created, true);
    }
  }

  const fid = (field: string) => `${id}-${field}`;
  const a11y = (field: keyof AgentFormValues) => ({
    id: fid(field),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${fid(field)}-error` : undefined,
  });

  return (
    <form
      id={formId}
      noValidate
      onSubmit={handleSubmit(save)}
      className="flex flex-col gap-6"
    >
      <div className="flex items-start gap-4">
        <PhotoPreview name={name} src={photo.trim()} />
        <FormField
          id={fid("photo")}
          label={copy.photo}
          optional
          help={copy.photoHelp}
          error={errors.photo?.message}
          className="flex-1"
        >
          <Input
            {...a11y("photo")}
            type="url"
            placeholder={copy.photoPlaceholder}
            {...register("photo")}
          />
        </FormField>
      </div>

      <FormField
        id={fid("name")}
        label={copy.name}
        error={errors.name?.message}
      >
        <Input {...a11y("name")} autoComplete="off" {...register("name")} />
      </FormField>

      <FormField
        id={fid("title")}
        label={copy.title}
        error={errors.title?.message}
      >
        <Input
          {...a11y("title")}
          placeholder={copy.titlePlaceholder}
          {...register("title")}
        />
      </FormField>

      <FormField
        id={fid("areas")}
        label={copy.areas}
        help={copy.areasHelp}
        error={errors.areas?.message}
      >
        <Controller
          control={control}
          name="areas"
          render={({ field }) => (
            <ToggleGroup
              id={fid("areas")}
              multiple
              variant="outline"
              value={field.value}
              onValueChange={(v) => field.onChange(v)}
              aria-invalid={!!errors.areas}
              className="flex-wrap justify-start"
            >
              {CITIES.map((city) => (
                <ToggleGroupItem
                  key={city}
                  value={city}
                  className="h-9 rounded-full! border px-3.5 text-muted-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                >
                  {city}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id={fid("years")}
          label={copy.years}
          error={errors.years?.message}
        >
          <Input
            {...a11y("years")}
            inputMode="numeric"
            className="tabular-nums"
            {...register("years")}
          />
        </FormField>
        <FormField
          id={fid("phone")}
          label={copy.phone}
          error={errors.phone?.message}
        >
          <Input
            {...a11y("phone")}
            type="tel"
            autoComplete="off"
            className="tabular-nums"
            {...register("phone")}
          />
        </FormField>
      </div>

      <FormField
        id={fid("email")}
        label={copy.email}
        error={errors.email?.message}
      >
        <Input
          {...a11y("email")}
          type="email"
          autoComplete="off"
          {...register("email")}
        />
      </FormField>

      <FormField
        id={fid("languages")}
        label={copy.languages}
        error={errors.languages?.message}
      >
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <TagInput
              id={fid("languages")}
              value={field.value}
              onChange={field.onChange}
              placeholder={copy.languagesPlaceholder}
              removeLabel={copy.removeTag}
            />
          )}
        />
      </FormField>

      <FormField id={fid("specialties")} label={copy.specialties} optional>
        <Controller
          control={control}
          name="specialties"
          render={({ field }) => (
            <TagInput
              id={fid("specialties")}
              value={field.value}
              onChange={field.onChange}
              placeholder={copy.specialtiesPlaceholder}
              removeLabel={copy.removeTag}
            />
          )}
        />
      </FormField>

      <FormField
        id={fid("shortBio")}
        label={copy.shortBio}
        error={errors.shortBio?.message}
        help={
          <span className="block text-right tabular-nums">
            {copy.shortBioHelp(shortBio.length, SHORT_BIO_MAX)}
          </span>
        }
      >
        <Textarea
          {...a11y("shortBio")}
          rows={4}
          className="rounded-[10px] leading-relaxed"
          {...register("shortBio")}
        />
      </FormField>
    </form>
  );
}

// Cancel and Save for the panel footer.
export function AgentFormButtons({
  formId,
  isNew,
  onCancel,
}: {
  formId: string;
  isNew: boolean;
  onCancel: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="ml-auto"
      >
        {copy.cancel}
      </Button>
      <Button type="submit" form={formId}>
        {isNew ? copy.create : copy.save}
      </Button>
    </>
  );
}

export default AgentForm;
