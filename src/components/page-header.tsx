// Top of an inner page: the page's h1 and an optional intro. The intro
// keeps a reading width on small screens and stays on one line on desktop.
function PageHeader({ title, subtext }: { title: string; subtext?: string }) {
  return (
    <header className="page-container pt-16 pb-10 md:pt-20 md:pb-12">
      <h1 className="type-display">{title}</h1>
      {subtext && (
        <p className="mt-4 max-w-measure text-lg text-pretty text-muted-foreground lg:max-w-none">
          {subtext}
        </p>
      )}
    </header>
  );
}

export default PageHeader;
