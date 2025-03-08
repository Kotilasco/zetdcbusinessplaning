// @ts-nocheck
"use server";

import { auth, signOut } from "@/auth";

export const logout = async () => {

  const session = await auth()

  await fetch(`${process.env.BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`
    }
  }).then(async () => await signOut())

};
