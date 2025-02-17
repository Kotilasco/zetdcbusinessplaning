"use server";

import { currentRole } from "@/lib/auth";
import { UserRoles } from "@/next-auth.d";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRoles.ROLE_ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" }
};
