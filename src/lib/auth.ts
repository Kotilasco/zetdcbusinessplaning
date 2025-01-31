//import { auth } from "@/auth";

export const currentUser = async () => {
 // const session = await auth();

 const session = {
  user : {
    user: {
      role: "admin"
    }
  }
 }
  return session?.user;
};

export const currentRole = async () => {
  //const session = await auth();
  const session = {
    user : {
      role: "admin"
    }
   }
  return session?.user?.role;
};
