import { useId, type ReactNode } from "react";

// One titled part of the editor, separated from the next by a hairline.
function FormSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border py-8 first:border-t-0 first:pt-0"
    >
      <h2 id={id} className="admin-section">
        {title}
      </h2>
      <p className="mt-1 text-muted-foreground">{help}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default FormSection;
