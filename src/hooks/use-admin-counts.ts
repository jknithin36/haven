import { useMessages } from "@/store/messages";
import { useRequests } from "@/store/requests";

// Counts shown in the sidebar: new tour requests and unread messages.
export function useAdminCounts() {
  const requests = useRequests();
  const messages = useMessages();
  return {
    newTours: requests.filter((r) => r.status === "new").length,
    unread: messages.filter((m) => !m.read && !m.archived).length,
  };
}
