// import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
 // const session = useSession();
 const session = {
  data : {
    user: {
      role: "admin",
      firstname: 'kuda',
      lastname: 'koti',
      email: 'k@k.com'
    }
  }
 }
  return session.data?.user;
};
