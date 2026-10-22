import ButtonLink from "@/components/button-link";
import PageMeta from "@/components/page-meta";
import EmptyState from "@/components/admin/empty-state";
import AdminPageHeader from "@/components/admin/admin-page-header";
import { adminLayout } from "@/data/admin";

const copy = adminLayout.notFound;

function AdminNotFound() {
  return (
    <>
      <PageMeta title={copy.title} noindex />
      <AdminPageHeader title={copy.title} />
      <div className="mt-8">
        <EmptyState
          text={copy.text}
          action={
            <ButtonLink to="/admin" variant="outline" size="default">
              {copy.back}
            </ButtonLink>
          }
        />
      </div>
    </>
  );
}

export default AdminNotFound;
