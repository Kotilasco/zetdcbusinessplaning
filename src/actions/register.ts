"use server"

import * as z from 'zod'
import { RegisterSchema, RegistrationSchema, UserCreationSchema } from "@/schema"
import { redirect } from 'next/navigation';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatesFields = RegisterSchema.safeParse(values);


    if (!validatesFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { firstname, lastname, email, password } = validatesFields.data;

    const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            "role": 'USER',
            "district": "EAST",
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    const user = await res.json()


    if (user !== null) {
        redirect('/auth/login');
        return {
            success: "Registered successfully"
        }
    }

    return {
        error: "Something went wrong"
    }

}


export const createUser = async (values: z.infer<typeof UserCreationSchema>) => {
    const validatesFields = UserCreationSchema.safeParse(values);


    if (!validatesFields.success) {
        return {
            error: "Invalid fields!"
        }
    }



    const { firstname, lastname, email, district, role } = validatesFields.data;



    const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/register?createdByAdmin=true`, {
        method: 'POST',
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            role,
            district,
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    const user = await res.json()

    console.log(user)

    if (user !== null) {
       /*  const subject = "ZETDE Customer Supplied Material System Password Reset"
        const message = `Dear ${user.firstname || "User"},\n\nWe have generated a temporary password for your account. Please use the following credentials to log in:\n\nTemporary Password: ${user.password}\n\nFor your security, we recommend changing this password immediately.\n\nIf you face any challenges,please contact our support team immediately.\n\nThank you,\nZetdc Customer Supplied Scheme Team`;

        await sendEmail({
            recipientEmail: user?.email,
            subject,
            message,
        }) */


        return {
            success: "User Created successfully"
        }
    }

    return {
        error: "Something went wrong"
    }

}