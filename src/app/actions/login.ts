"use server"

import * as z from 'zod'
import { ChangePasswordSchema, LoginSchema } from "@/schema"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { email, password } = validatedFields.data;

    //console.log(email, password)

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })

        return { success: "Success" }
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error)
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        error: "Invalid credentials"
                    }
                case "AccessDenied": {
                    return {
                        error: "Please change your password"
                    }
                }
                default:
                    return {
                        error: "Something went wrong"
                    }

            }
        }
        throw error;
    }
}

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
    const validatedFields = ChangePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { email, password, newPassword } = validatedFields.data;

    // /api/v1/auth/change-password/{email}/{currentPassword}/{newPassword}

    try {

        const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/change-password/${email}/${password}/${newPassword}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        // const user = await res.json()


        if (res.ok) {
            redirect('/auth/login');
            return {
                success: "Registered successfully"
            }
        }

        return {
            error: "Change Password failed"
        }
    }
    catch (error) {
        if (error instanceof AuthError) {
            console.log(error)
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        error: "Invalid credentials"
                    }
                default:
                    return {
                        error: "Something went wrong"
                    }

            }
        }
        throw error;
    }
}