import { resetActivity } from "@/store/activity";
import { resetAgents } from "@/store/agents";
import { resetMessages } from "@/store/messages";
import { resetProperties } from "@/store/properties";
import { resetRequests } from "@/store/requests";

// Restores every dashboard store to its seed data.
export function resetDemoData() {
  resetProperties();
  resetAgents();
  resetRequests();
  resetMessages();
  resetActivity();
}
