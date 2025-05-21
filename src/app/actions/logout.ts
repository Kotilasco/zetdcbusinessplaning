// @ts-nocheck
"use server";

import { auth, signOut } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {

  const session = await auth()
  const headersList = headers();
    const callbackUrl = headersList.get('referer') || "/"; // Get the previous URL

    console.log("logging out .....")
    console.log(callbackUrl);
    console.log(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    console.log(session?.access_token)

  await fetch(`${process.env.BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`
    }
  }).then(async () => await signOut({
    redirectTo: `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
  })).then(() =>  redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`))



  console.log('redirecting .....')

   // Redirect to the login page with the callback URL
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

};
