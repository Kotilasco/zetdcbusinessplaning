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



    const { firstname, lastname, email, role, department, section, division } = validatesFields.data;



    const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            role,
            departmentId: department,
            sectionId: section,
            divisionId: division,
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    const user = await res.json()

   // console.log(user)

    if (user !== null) {
    
        return {
            success: "User Created successfully"
        }
    }

    return {
        error: "Something went wrong"
    }

}