import type { ReactNode } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { propertyEditorPage } from "@/data/admin";
import { cn } from "@/lib/utils";

// Label, control, optional help line, and inline error. The control should
// set aria-invalid and point aria-describedby at `${id}-error`.
function FormField({
  id,
  label,
  optional,
  hideLabel,
  help,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hideLabel?: boolean; // when the section title already says it
  help?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={!!error} className={cn("gap-2", className)}>
      <FieldLabel
        htmlFor={id}
        className={cn("font-medium", hideLabel && "sr-only")}
      >
        {label}
        {optional && (
          <span className="font-normal text-faint">
            {propertyEditorPage.fields.optional}
          </span>
        )}
      </FieldLabel>
      {children}
      {help && <FieldDescription>{help}</FieldDescription>}
      {error && (
        <FieldError id={`${id}-error`} className="text-attention">
          {error}
        </FieldError>
      )}
    </Field>
  );
}

export default FormField;
