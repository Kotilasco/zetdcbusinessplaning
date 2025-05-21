'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useCurrentUser = () => {

  const router = useRouter();

  const session = useSession();
 
  console.log(session?.data)
  return session.data?.user;   
};
