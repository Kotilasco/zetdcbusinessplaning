//@ts-nocheck

import { ExtendedUser } from '@/next-auth';
import NextAuth from "next-auth"
import authConfig from "@/auth.config";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },

    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log(auth?.user)

            const isLoggedIn = !!auth?.user;

     //       console.log(auth)

            const isOnDashboard = nextUrl.pathname.startsWith('/');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
        async signIn({ user }) {
          //  console.log(user)
            if (user.temporaryPassword) {
              //  console.log("here we go")
                throw new Error("Please change your passsword")
                return Response.redirect(new URL('/auth/change-password')); // Redirect to change password page
            }
            return true;
        },
        async jwt({ token, user, account }) {
           /* console.log("JWT callback - token before processing:", token);
            console.log("JWT callback - user:", user); */ // Will only be available on initial sign-in

            // 1. If this is the initial sign-in, add user information to the token
            if (user) {
               // console.log("JWT callback - Initial sign-in");
                return {
                    ...token,
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    sectionId: user.sectionId,
                    departmentId: user.departmentId,
                    divisionId: user.divisionId,
                    role: user.roles?.slice(-1)[0], // Ensure roles array exists before slicing
                    accessTokenExpires: Date.now() + 1000 * 60 * 10, // 30 minutes
                };
            }

            // 2. If it's not the initial sign-in, simply return the existing token
            if (Date.now() < token.accessTokenExpires) {
               // console.log("JWT callback - Token is still valid");
                return token;
            }

            // 3. If the token is expired, refresh it
            console.log("JWT callback - Token expired, attempting to refresh");
            return await refreshAccessToken(token);
        },
        async session({ token, session }) {

           /* console.log("Session callback - token:", token);
            console.log("Session callback - session:", session); */

            if (token) {
                session.user.email = token.email;
                session.user.firstname = token.firstname;
                session.user.lastname = token.lastname;    
                session.user.sectionId = token.sectionId;
                session.user.departmentId = token.departmentId;
                session.user.role = token.role;
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user.divisionId = token.divisionId;
            }

           //  console.log("Session callback - session after processing:", session);

            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 60, // Session expiration time in seconds (e.g., 30 minutes)
        updateAge: 5 * 60, // Time in seconds to update the session
    },

    ...authConfig,
});


async function refreshAccessToken(token) {
    try {
       //  console.log("Refreshing access token...", token.refresh_token);

        const response = await fetch(`${process.env.BASE_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: token.refresh_token }),
        });

        console.log("Response from refresh token endpoint:", response); // Debugging log

        const refreshedTokens = await response.json();

      //  console.log("Refreshed tokens:", refreshedTokens);

        if (!response.ok) throw new Error("Failed to refresh token");

        return {
            ...token,
            access_token: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Keep old refresh token if new one is not provided
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}