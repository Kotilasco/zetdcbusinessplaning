import nodemailer from "nodemailer";

export async function sendE() {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for other ports
            auth: {
                user: "johndoe@gmail.com",
                pass: "rrqoamkyyrhtopjj",
            },
        });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"kudakote@gmail.com',
            to: "kotilasco@gmail.com",
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}