import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_USER,
  type AdminUser,
} from "@/data/demo-auth";
import { createLocalStore } from "@/lib/local-store";

// The signed-in user, saved in the browser under "haven-auth".
// null means nobody is signed in.
const store = createLocalStore<AdminUser | null>("haven-auth", null);

// Demo check: the email ignores spaces and capital letters, the password
// must match exactly. Returns true when the sign-in worked.
export function signIn(email: string, password: string): boolean {
  const emailMatches = email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase();
  const passwordMatches = password === DEMO_PASSWORD;

  if (!emailMatches || !passwordMatches) return false;

  store.write(DEMO_USER);
  return true;
}

export function signOut() {
  store.write(null);
}

// Components call this to read the current user. They re-render when it
// changes.
export function useAuthUser() {
  return store.useValue();
}
