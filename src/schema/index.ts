import { setConfig } from 'next/config';
import { UserRoles } from './../next-auth.d';

import * as z from "zod"

const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/;


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})


export const ChangePasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    newPassword: z.string().min(6, {
        message: "Minimum 6 charachters required",
    }).regex(new RegExp(pattern), {
        message: "The password must contain at least one special character, one uppercase letter, one lowercase letter, and at least one number",
    }),
})

export const RegisterSchema = z.object({
    firstname: z.string().min(1, {
        message: "Last name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 charachters required",
    }).regex(new RegExp(pattern), {
        message: "The password must contain at least one special character, one uppercase letter, one lowercase letter, and at least one number",
    }),
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
})

export const RegistrationSchema = z.object({
    firstname: z.string().min(1, {
        message: "First name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    /*  password: z.string().min(6, {
         message: "Minimum 6 characters required",
     }).regex(new RegExp(pattern), {
         message: "The password must contain at least one special character, one uppercase letter, one lowercase letter, and at least one number",
     }), */
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
    reference: z.string({
        required_error: "Please select a valid reference",
    }),
    pjob: z.string().regex(/^P\d{14}$/, {
        message: "Account must match the pattern PXXXXXXXXXXXXXX",
    }),
    referenceNo: z
        .string({
            required_error: "Please enter a valid reference",
        })
        .min(4, {
            message: "Reference number must be at least 4 characters long.",
        }),
})


export const DepartmentCreationSchema = z.object({
    name: z.string().min(3, {
        message: "Department name is required",
    }),
    sections: z.array(z.string())
})

export const MemberCreationSchemaByManager = z.object({
    firstname: z.string().min(1, {
        message: "First name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
    designation: z.string().min(1, {
        message: "Disgnation is required",
    }),
    ecnum: z.string().min(1, {
        message: "Ec Number is required",
    }),

})

export const MemberCreationSchema = z.object({
    firstname: z.string().min(1, {
        message: "First name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
    designation: z.string().min(1, {
        message: "Disgnation is required",
    }),
    ecnum: z.string().min(1, {
        message: "Ec Number is required",
    }),
    department: z.number({required_error: "Please enter a valid EC number"}),
    section: z.number({required_error: "Please enter a valid EC number"}),

})

/* 
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "role": "SUPERADMIN",
  "sectionId": 0,
  "departmentId": 0
}
*/

export const UserCreationSchema = z.object({
    firstname: z.string().min(1, {
        message: "First name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
    role: z
        .string({
            required_error: "Please enter a role",
        })
        .min(2, {
            message: "Reference number must be at least 4 characters long.",
        }),
        department: z.number({required_error: "Please enter a valid department id"}),
        section: z.number({required_error: "Please enter a valid section id"}),
        division: z.number({required_error: "Please enter a valid division id"}),

})

export const RegistrationFaultSchema = z.object({
    firstname: z.string().min(1, {
        message: "Last name is required",
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    lastname: z.string().min(1, {
        message: "Last name is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }).regex(new RegExp(pattern), {
        message: "The password must contain at least one special character, one uppercase letter, one lowercase letter, and at least one number",
    }),
    reference: z.string({
        required_error: "Please select a valid reference",
    }),
    faultNo: z.string({
        required_error: "Please select a valid reference",
    }),
    referenceNo: z
        .string({
            required_error: "Please enter a valid reference",
        })
        .min(4, {
            message: "Reference number must be at least 4 characters long.",
        }),
})

export const IcsVerificationSchema = z.object({
    reference: z.string({
        required_error: "Please select a valid reference",
    }),
    pjob: z.string().regex(/^P\d{14}$/, {
        message: "Account must match the pattern PXXXXXXXXXXXXXX",
    }),
    referenceNo: z
        .string({
            required_error: "Please enter a valid reference",
        })
        .min(4, {
            message: "Reference number must be at least 4 characters long.",
        }),

});


export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRoles.ROLE_ADMIN, UserRoles.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }

        return true;
    }, {
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }

        return true;
    }, {
        message: "Password is required!",
        path: ["password"]
    })

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});