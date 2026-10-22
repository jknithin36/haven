import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { useBlocker, useNavigate, useParams } from "react-router";

import AdminPageHeader from "@/components/admin/admin-page-header";
import EmptyState from "@/components/admin/empty-state";
import AgentSelect from "@/components/admin/property-editor/agent-select";
import EditorPreview from "@/components/admin/property-editor/editor-preview";
import FormField from "@/components/admin/property-editor/form-field";
import FormSection from "@/components/admin/property-editor/form-section";
import PhotosField from "@/components/admin/property-editor/photos-field";
import SimpleSelect from "@/components/admin/property-editor/simple-select";
import TagInput from "@/components/admin/property-editor/tag-input";
import ButtonLink from "@/components/button-link";
import PageMeta from "@/components/page-meta";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { propertyEditorPage as copy, statusLabels } from "@/data/admin";
import { propertyDetailPage } from "@/data/pages";
import { locationOptions, typeOptions, ALL } from "@/data/property-filters";
import { notify } from "@/lib/notify";
import {
  DESCRIPTION_MAX,
  EDITABLE_STATUSES,
  FEATURE_GROUPS,
  FLOOD_ZONES,
  emptyFormValues,
  fromFormValues,
  newPropertyBase,
  paragraphs,
  propertySchemas,
  slugify,
  toFormValues,
  type PropertyFormValues,
} from "@/lib/property-form";
import { cn } from "@/lib/utils";
import { useAgents } from "@/store/agents";
import {
  addProperty,
  getPropertyById,
  updateProperty,
  useAllProperties,
  withPhotoFields,
  type ListedProperty,
} from "@/store/properties";

type Intent = "draft" | "publish";

const f = copy.fields;
const fieldId = (name: string) => `property-${name}`;

const cityOptions = locationOptions
  .filter((o) => o.value !== ALL)
  .map((o) => ({ value: o.label, label: o.label }));
const homeTypeOptions = typeOptions
  .filter((o) => o.value !== ALL)
  .map((o) => ({ value: o.label, label: o.label }));
const statusOptions = EDITABLE_STATUSES.map((s) => ({
  value: s,
  label: statusLabels.property[s],
}));
const floodOptions = FLOOD_ZONES.map((z) => ({
  value: z,
  label: propertyDetailPage.details.zone(z),
}));

// Labels for the error summary, in the order the fields appear.
const FIELD_LABELS = {
  name: f.name,
  slug: f.slug,
  price: f.price,
  type: f.type,
  city: f.city,
  neighborhood: f.neighborhood,
  address: f.address,
  zip: f.zip,
  beds: f.beds,
  baths: f.baths,
  sqft: f.sqft,
  lotSqft: f.lotSqft,
  yearBuilt: f.yearBuilt,
  garage: f.garage,
  hoaMonthly: f.hoaMonthly,
  taxesYearly: f.taxesYearly,
  deposit: f.deposit,
  description: f.description,
  photos: copy.sections.photos.title,
  agentId: f.agent,
} satisfies Partial<Record<keyof PropertyFormValues, string>>;
const FIELD_ORDER = Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[];

function isMac() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

// Props that connect a control to its label and error line.
function a11y(name: string, error?: { message?: string }) {
  return {
    id: fieldId(name),
    "aria-invalid": !!error,
    "aria-describedby": error ? `${fieldId(name)}-error` : undefined,
  };
}

function EditorForm({ property }: { property?: ListedProperty }) {
  const navigate = useNavigate();
  const agents = useAgents();
  const homes = useAllProperties();
  const intentRef = useRef<Intent>("publish");
  const leavingRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [slugEdited, setSlugEdited] = useState(!!property);
  const [showSummary, setShowSummary] = useState(false);
  const [base] = useState<ListedProperty>(
    () =>
      property ??
      newPropertyBase(
        agents[0]?.id ?? "",
        homes[0]?.coordinates ?? {
          lat: 0,
          lng: 0,
        },
      ),
  );

  const schemas = useMemo(() => propertySchemas(property?.id), [property?.id]);
  // Drafts and publishing use different rules; the button picks which.
  const resolver: Resolver<PropertyFormValues> = (values, context, options) => {
    const schema =
      intentRef.current === "draft" ? schemas.draft : schemas.publish;
    const run = zodResolver(schema) as unknown as Resolver<PropertyFormValues>;
    return run(values, context, options);
  };

  const form = useForm<PropertyFormValues>({
    defaultValues: property
      ? toFormValues(property)
      : emptyFormValues(base.agentId),
    resolver,
    // Publishing focuses the error summary; drafts focus the first field.
    shouldFocusError: false,
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty, isSubmitted },
  } = form;
  // Every field has a default, so the watched values are complete.
  const values = useWatch({ control }) as PropertyFormValues;
  const rent = values.priceType === "rent";

  // What the card will look like once saved.
  const preview = withPhotoFields(fromFormValues(values, base));
  const savedSlug = property?.status === "active" ? property.slug : undefined;

  // Keep the URL in step with the name until someone edits it by hand.
  const name = values.name;
  useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(name), { shouldValidate: isSubmitted });
    }
  }, [name, slugEdited, setValue, isSubmitted]);

  // Ask before leaving with unsaved changes, in the app and in the browser.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !leavingRef.current &&
      currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  function save(v: PropertyFormValues, intent: Intent) {
    const status =
      intent === "draft" ? "draft" : v.status === "draft" ? "active" : v.status;
    const coordinates =
      homes.find((h) => h.city === v.city)?.coordinates ?? base.coordinates;
    const home = fromFormValues({ ...v, status }, { ...base, coordinates });
    if (property) updateProperty(property.id, home);
    else addProperty(home);
    const nowPublic = status === "active" && property?.status !== "active";
    notify(nowPublic ? copy.toasts.published : copy.toasts.saved);
    leavingRef.current = true;
    navigate("/admin/properties");
  }

  function onInvalid(intent: Intent) {
    return (invalid: Record<string, unknown>) => {
      if (intent === "publish") {
        setShowSummary(true);
        requestAnimationFrame(() => {
          summaryRef.current?.scrollIntoView({ block: "center" });
          summaryRef.current?.focus({ preventScroll: true });
        });
      } else {
        const first = FIELD_ORDER.find((key) => key in invalid);
        if (first) document.getElementById(fieldId(first))?.focus();
      }
    };
  }

  function submit(intent: Intent) {
    intentRef.current = intent;
    void handleSubmit((v) => save(v, intent), onInvalid(intent))();
  }

  // ⌘S saves: as a draft if the status says draft, otherwise publishes.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        submit(getValues("status") === "draft" ? "draft" : "publish");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const errorList = FIELD_ORDER.filter((key) => errors[key]).map((key) => ({
    key,
    label: FIELD_LABELS[key],
    message: errors[key]?.message ?? "",
  }));

  // "Publish" while the home isn't public yet; "Save changes" after that.
  const primaryLabel =
    values.status === "sold" ||
    values.status === "rented" ||
    property?.status === "active"
      ? copy.footer.saveChanges
      : copy.footer.publish;
  const descriptionLength = values.description.length;
  const paragraphCount = paragraphs(values.description).length;
  const title = property ? property.name : values.name.trim() || copy.newTitle;

  return (
    <>
      <PageMeta
        title={
          property ? copy.meta.editTitle(property.name) : copy.meta.newTitle
        }
        noindex
      />
      <AdminPageHeader title={title} />

      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit("publish");
          }}
          className="lg:col-span-8"
        >
          {showSummary && errorList.length > 0 && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="mb-8 rounded-[14px] border border-foreground p-5 outline-none"
            >
              <p className="flex items-center gap-2 font-semibold">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-attention"
                />
                {copy.summary.title(errorList.length)}
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {errorList.map((e) => (
                  <li key={e.key}>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(fieldId(e.key))?.focus()
                      }
                      className="admin-focus rounded-sm text-left underline-offset-4 hover:underline"
                    >
                      <span className="font-medium">{e.label}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {e.message}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. Basics */}
          <FormSection {...copy.sections.basics}>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id={fieldId("name")}
                label={f.name}
                error={errors.name?.message}
                className="sm:col-span-2"
              >
                <Input {...a11y("name", errors.name)} {...register("name")} />
              </FormField>
              <FormField
                id={fieldId("slug")}
                label={f.slug}
                error={errors.slug?.message}
                className="sm:col-span-2"
              >
                <InputGroup className="rounded-[10px]">
                  <InputGroupAddon>
                    <InputGroupText className="font-normal text-faint">
                      {f.slugPrefix}
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...a11y("slug", errors.slug)}
                    {...register("slug", {
                      onChange: () => setSlugEdited(true),
                    })}
                  />
                </InputGroup>
              </FormField>
              <FormField id={fieldId("status")} label={f.status}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <SimpleSelect
                      id={fieldId("status")}
                      value={field.value}
                      options={statusOptions}
                      onChange={field.onChange}
                      placeholder={f.select}
                    />
                  )}
                />
              </FormField>
              <FormField id={fieldId("priceType")} label={f.priceType}>
                <Controller
                  control={control}
                  name="priceType"
                  render={({ field }) => (
                    <ToggleGroup
                      id={fieldId("priceType")}
                      variant="outline"
                      value={[field.value]}
                      onValueChange={(v) => v[0] && field.onChange(v[0])}
                      className="w-full"
                    >
                      {(["sale", "rent"] as const).map((v) => (
                        <ToggleGroupItem
                          key={v}
                          value={v}
                          className="h-9 flex-1 text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
                        >
                          {f[v]}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                />
              </FormField>
              <FormField
                id={fieldId("price")}
                label={rent ? f.pricePerMonth : f.price}
                error={errors.price?.message}
              >
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <InputGroup className="rounded-[10px]">
                      <InputGroupAddon>
                        <InputGroupText>{f.currency}</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...a11y("price", errors.price)}
                        ref={field.ref}
                        inputMode="numeric"
                        className="tabular-nums"
                        value={
                          field.value
                            ? Number(field.value).toLocaleString("en-US")
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                        onBlur={field.onBlur}
                      />
                    </InputGroup>
                  )}
                />
              </FormField>
              <FormField
                id={fieldId("type")}
                label={f.type}
                error={errors.type?.message}
              >
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <SimpleSelect
                      id={fieldId("type")}
                      value={field.value}
                      options={homeTypeOptions}
                      onChange={field.onChange}
                      placeholder={f.select}
                      invalid={!!errors.type}
                    />
                  )}
                />
              </FormField>
              <FormField
                id={fieldId("city")}
                label={f.city}
                error={errors.city?.message}
              >
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <SimpleSelect
                      id={fieldId("city")}
                      value={field.value}
                      options={cityOptions}
                      onChange={field.onChange}
                      placeholder={f.select}
                      invalid={!!errors.city}
                    />
                  )}
                />
              </FormField>
              <FormField
                id={fieldId("neighborhood")}
                label={f.neighborhood}
                error={errors.neighborhood?.message}
              >
                <Input
                  {...a11y("neighborhood", errors.neighborhood)}
                  {...register("neighborhood")}
                />
              </FormField>
              <FormField
                id={fieldId("address")}
                label={f.address}
                error={errors.address?.message}
              >
                <Input
                  {...a11y("address", errors.address)}
                  autoComplete="off"
                  {...register("address")}
                />
              </FormField>
              <FormField
                id={fieldId("zip")}
                label={f.zip}
                error={errors.zip?.message}
              >
                <Input
                  {...a11y("zip", errors.zip)}
                  inputMode="numeric"
                  maxLength={5}
                  className="tabular-nums"
                  {...register("zip")}
                />
              </FormField>
            </div>
          </FormSection>

          {/* 2. Details */}
          <FormSection {...copy.sections.details}>
            <div className="grid gap-6 sm:grid-cols-3">
              {(
                [
                  ["beds", "numeric", false],
                  ["baths", "decimal", false],
                  ["sqft", "numeric", false],
                  ["lotSqft", "numeric", true],
                  ["yearBuilt", "numeric", false],
                  ["garage", "numeric", true],
                  ["hoaMonthly", "numeric", true],
                ] as const
              ).map(([name, mode, optional]) => (
                <FormField
                  key={name}
                  id={fieldId(name)}
                  label={f[name]}
                  optional={optional}
                  error={errors[name]?.message}
                >
                  <Input
                    {...a11y(name, errors[name])}
                    inputMode={mode}
                    className="tabular-nums"
                    {...register(name)}
                  />
                </FormField>
              ))}
              {rent ? (
                <>
                  <FormField
                    id={fieldId("deposit")}
                    label={f.deposit}
                    optional
                    error={errors.deposit?.message}
                  >
                    <Input
                      {...a11y("deposit", errors.deposit)}
                      inputMode="numeric"
                      className="tabular-nums"
                      {...register("deposit")}
                    />
                  </FormField>
                  <FormField
                    id={fieldId("leaseTerm")}
                    label={f.leaseTerm}
                    optional
                  >
                    <Input
                      id={fieldId("leaseTerm")}
                      placeholder={f.leaseTermPlaceholder}
                      {...register("leaseTerm")}
                    />
                  </FormField>
                  <FormField
                    id={fieldId("availableFrom")}
                    label={f.availableFrom}
                    optional
                  >
                    <Input
                      id={fieldId("availableFrom")}
                      type="date"
                      {...register("availableFrom")}
                    />
                  </FormField>
                </>
              ) : (
                <FormField
                  id={fieldId("taxesYearly")}
                  label={f.taxesYearly}
                  optional
                  error={errors.taxesYearly?.message}
                >
                  <Input
                    {...a11y("taxesYearly", errors.taxesYearly)}
                    inputMode="numeric"
                    className="tabular-nums"
                    {...register("taxesYearly")}
                  />
                </FormField>
              )}
              <FormField
                id={fieldId("floodZone")}
                label={f.floodZone}
                help={propertyDetailPage.details.floodZones[values.floodZone]}
                className="sm:col-span-3"
              >
                <div className="sm:max-w-[calc((100%-3rem)/3)]">
                  <Controller
                    control={control}
                    name="floodZone"
                    render={({ field }) => (
                      <SimpleSelect
                        id={fieldId("floodZone")}
                        value={field.value}
                        options={floodOptions}
                        onChange={field.onChange}
                        placeholder={f.select}
                      />
                    )}
                  />
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* 3. Description */}
          <FormSection {...copy.sections.description}>
            <FormField
              id={fieldId("description")}
              label={f.description}
              hideLabel
              error={errors.description?.message}
              help={
                <span className="flex justify-between tabular-nums">
                  <span>{f.paragraphs(paragraphCount)}</span>
                  <span
                    className={cn(
                      descriptionLength > DESCRIPTION_MAX && "text-attention",
                    )}
                  >
                    {f.characters(descriptionLength, DESCRIPTION_MAX)}
                  </span>
                </span>
              }
            >
              <Textarea
                {...a11y("description", errors.description)}
                rows={8}
                className="rounded-[10px] leading-relaxed"
                {...register("description")}
              />
            </FormField>
          </FormSection>

          {/* 4. Photos */}
          <FormSection {...copy.sections.photos}>
            <div id={fieldId("photos")} tabIndex={-1} className="outline-none">
              <Controller
                control={control}
                name="photos"
                render={({ field }) => (
                  <PhotosField
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.photos}
                  />
                )}
              />
            </div>
            {errors.photos && (
              <p role="alert" className="mt-3 text-sm text-attention">
                {errors.photos.message}
              </p>
            )}
          </FormSection>

          {/* 5. Features */}
          <FormSection {...copy.sections.features}>
            <div className="flex flex-col gap-6">
              {FEATURE_GROUPS.map((group) => (
                <FormField
                  key={group}
                  id={fieldId(`features-${group}`)}
                  label={group}
                >
                  <Controller
                    control={control}
                    name={`features.${group}`}
                    render={({ field }) => (
                      <TagInput
                        id={fieldId(`features-${group}`)}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder={copy.features.placeholder(group)}
                        removeLabel={copy.features.remove}
                      />
                    )}
                  />
                </FormField>
              ))}
            </div>
          </FormSection>

          {/* 6. Agent */}
          <FormSection {...copy.sections.agent}>
            <FormField
              id={fieldId("agentId")}
              label={f.agent}
              error={errors.agentId?.message}
            >
              <Controller
                control={control}
                name="agentId"
                render={({ field }) => (
                  <AgentSelect
                    id={fieldId("agentId")}
                    agents={agents}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={f.select}
                    invalid={!!errors.agentId}
                  />
                )}
              />
            </FormField>
          </FormSection>

          {/* Sticky footer */}
          <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:mx-0 lg:px-0">
            <p
              aria-live="polite"
              className="mr-auto flex items-center gap-2 text-muted-foreground"
            >
              {isDirty && (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-foreground"
                  />
                  {copy.footer.unsaved}
                </>
              )}
            </p>
            <ButtonLink to="/admin/properties" variant="ghost" size="default">
              {copy.footer.cancel}
            </ButtonLink>
            <Button
              type="button"
              variant="outline"
              onClick={() => submit("draft")}
            >
              {copy.footer.saveDraft}
            </Button>
            <Button type="submit" aria-keyshortcuts="Meta+S">
              {primaryLabel}
              <KbdGroup className="hidden sm:inline-flex">
                <Kbd className="bg-background/15 text-background">
                  {isMac() ? "⌘" : "Ctrl"}
                </Kbd>
                <Kbd className="bg-background/15 text-background">S</Kbd>
              </KbdGroup>
            </Button>
          </div>
        </form>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-22">
            <EditorPreview property={preview} savedSlug={savedSlug} />
          </div>
        </aside>
      </div>

      <AlertDialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => !open && blocker.reset?.()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.leave.title}</AlertDialogTitle>
            <AlertDialogDescription>{copy.leave.text}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.leave.stay}</AlertDialogCancel>
            <AlertDialogAction onClick={() => blocker.proceed?.()}>
              {copy.leave.leave}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// /admin/properties/new and /admin/properties/:id/edit
function PropertyEditor() {
  const { id } = useParams();
  const property = id ? getPropertyById(id) : undefined;

  if (id && !property) {
    return (
      <>
        <PageMeta title={copy.notFound.text} noindex />
        <EmptyState
          text={copy.notFound.text}
          action={
            <ButtonLink to="/admin/properties" variant="outline" size="default">
              {copy.notFound.action}
            </ButtonLink>
          }
        />
      </>
    );
  }
  // A fresh form per home, so switching homes resets it.
  return <EditorForm key={id ?? "new"} property={property} />;
}

export default PropertyEditor;
