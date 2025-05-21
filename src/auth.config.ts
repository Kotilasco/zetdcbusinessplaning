import { NextAuthConfig } from "next-auth";
import Credentials from 'next-auth/providers/credentials'
import { LoginSchema } from "@/schema"

export default {
    providers: [
        Credentials({
            async authorize(credentials: any) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const payload = { email, password }
                    const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/authenticate`, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    const user = await res.json()

                    const jwt = user.access_token;

               

                    if (res.ok && user) {
                        return {
                            ...user,
                            jwt
                        }
                    }

                    return null
                }

            }
        })
    ]
} satisfies NextAuthConfig