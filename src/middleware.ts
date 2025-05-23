import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (nextUrl.pathname === "/api/send-email") {
        return null; // Allow request without authentication
    }

    console.log("Middleware running on:", nextUrl.pathname);

    if (nextUrl.pathname.startsWith("/api/file")) {
       // console.log("Allowing API request:", nextUrl.pathname);
        return null; // Allow request without authentication
      }
      


    if (nextUrl.pathname === "/api/file") {
       // console.log("Middleware allowing access to /api/file");
        return null; // Allow request without authentication
      }


    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        console.log(isLoggedIn, isPublicRoute);
        console.log("Auth route:", nextUrl.pathname);
        if (isLoggedIn) {
            console.log('i am here')
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        console.log('jjkjjdjdjjdj')
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        console.log('reached here')
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}