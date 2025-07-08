"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "@/lib/utils";

// <aside>

// 1. User enters full name and email

// 2. Check if the use already exist using the email (we will use this to identify if we still need to create a user document or not)

// 3. send otp to user's email

// this will send a secret key for creating the session. 

// 4. Create a new user document if the user is new

// 5. return the user's accountId that will be used to complete the login

// 6. verify OTP and authenticate to login

// </aside>

const backendUrl = process.env.BASE_URL || 'https://localhost:8080'; // Replace with your backend URL

const getUserByEmail = async (email: string) => {
    try {
        const response = await fetch(`${backendUrl}/users?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user by email");
        }

        const data = await response.json();
        return data.user || null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

const handleError = (error: unknown, message: string) => {
    console.error(error, message);
    throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
    try {
        const response = await fetch(`${backendUrl}/api/v1/auth/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email OTP");
        }

        const data = await response.json();
        console.log("OTP sent successfully:", data);
        return {
            message: "OTP sent successfully",
        };
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
};

export const createAccount = async ({
    fullName,
    email,
}: {
    fullName: string;
    email: string;
}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });

    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
        try {
            const response = await fetch(`${backendUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    avatar: avatarPlaceholderUrl,
                    accountId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create user");
            }
        } catch (error) {
            handleError(error, "Failed to create user");
        }
    }

    return parseStringify({ accountId });
};

export const verifySecret = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const response = await fetch(`${backendUrl}/auth/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to verify OTP");
        }

        const data = await response.json();
        (await cookies()).set("user-session", data.session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify({ sessionId: data.session.id });
    } catch (error) {
        handleError(error, "Failed to verify OTP");
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${backendUrl}/auth/current-user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${(await cookies()).get("user-session")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get current user");
        }

        const data = await response.json();
        return parseStringify(data.user);
    } catch (error) {
        console.error("Error fetching current user:", error);
    }
};

export const signOutUser = async () => {
    try {
        const response = await fetch(`${backendUrl}/auth/sign-out`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${(await cookies()).get("user-session")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to sign out user");
        }

        (await cookies()).delete("user-session");
    } catch (error) {
        handleError(error, "Failed to sign out user");
    } finally {
        redirect("/sign-in");
    }
};

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);

        // User exists, send OTP
        if (existingUser) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existingUser.accountId });
        }

        return parseStringify({ accountId: null, error: "User not found" });
    } catch (error) {
        handleError(error, "Failed to sign in user");
    }
};