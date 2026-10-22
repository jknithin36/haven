// Fictional data for demo purposes only. This is a demo login with no
// backend: anyone who reads the code can see these details.

export const DEMO_EMAIL = "nithinkumarjk1@gmail.com";
export const DEMO_PASSWORD = "12345678";

export type AdminUser = {
  name: string;
  role: string;
  email: string;
  avatar?: string;
};

export const DEMO_USER: AdminUser = {
  name: "Nithin",
  role: "Admin",
  email: DEMO_EMAIL,
};
