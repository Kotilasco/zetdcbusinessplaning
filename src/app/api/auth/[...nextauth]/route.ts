import NextAuth from "next-auth";
import authConfig from '@/auth.config';

// Create the NextAuth handler
const handler = NextAuth(authConfig);

// Export the GET and POST handlers for the route
export { handler as GET, handler as POST };