"use server"

import sgMail, { MailDataRequired } from '@sendgrid/mail';

type Props = {
    to: string;
    templateName?: string;
    dynamicTemplateData?: Record<string, string>;
}

export const sendEmail = async ({
    to,
    templateName,
    dynamicTemplateData
}: Props) => {

    console.log("1")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    console.log("api")
    const msg = {
        to,
        from: "johndoe@gmail.com", // Use the email address or domain you verified above
        // templateId: "",
        dynamicTemplateData,
        subject: 'Hello',
        text: 'hello world',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    //ES6
    /* sgMail
        .send(msg)
        .then(() => { }, error => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }); */
    //ES8


    (async () => {
        try {
            console.log("we are here ")
            await sgMail.send(msg).then((res) => console.log(res));
            console.log("2")
        } catch (error: any) {
            console.log(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    })();
    console.log("we are here")
}