import { Route, Routes } from "react-router";

import AdminLayout from "@/layouts/AdminLayout";
import Activity from "@/pages/admin/Activity";
import AdminAgents from "@/pages/admin/AdminAgents";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminNotFound from "@/pages/admin/AdminNotFound";
import AdminProperties from "@/pages/admin/AdminProperties";
import Messages from "@/pages/admin/Messages";
import Overview from "@/pages/admin/Overview";
import PropertyEditor from "@/pages/admin/PropertyEditor";
import Tours from "@/pages/admin/Tours";

// Every /admin page. App.tsx loads this file only when someone opens
// /admin, so visitors to the public site never download dashboard code.
function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      {/* Every other admin page needs a signed-in user (AdminLayout). */}
      <Route element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/new" element={<PropertyEditor />} />
        <Route path="properties/:id/edit" element={<PropertyEditor />} />
        <Route path="tours" element={<Tours />} />
        <Route path="messages" element={<Messages />} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="activity" element={<Activity />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
