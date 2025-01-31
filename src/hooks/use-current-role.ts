//import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
 // const session = useSession();

 const session = {
  data : {
    user: {
      role: "admin"
    }
  }
 }


  return session.data?.user?.role;
};
