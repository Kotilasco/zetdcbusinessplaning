import emailjs from '@emailjs/browser';
import React, { useRef } from 'react';

type Props = {
    to: string;
    message: string;
    replyTo?: string;
};

emailjs.init("gQIp5DGUn3dHULLpM"); // Initialize EmailJS with your public key

export const sendEmailjs = ({ to, message, replyTo = '' }: Props) => {
    emailjs.send(
        "service_pegmagy",
        "template_szm9v5c",
        {
            email: to,
            message: message,
            reply_to: replyTo,
        }
    )
        .then(() => {
            console.log('SUCCESS!');
        })
        .catch((error) => {
            console.log('FAILED..', error);
        });
};
