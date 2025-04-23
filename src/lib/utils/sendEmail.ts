declare interface EmailProps {
    // fd: string, od: string, nf: string, folderName: string, path: string
    recipientEmail: string;
    subject: string;
    message: string;
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const sendEmail = async (
    {
        recipientEmail,
        subject,
        message
    }: EmailProps
) => {

    try {
        const res = await fetch("http://localhost:3000/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipientEmail,
                subject,
                message,
            }),
        });

        console.log(res)

        // const response = await res.json()
        //console.log(response)

        if (!res.ok) {
           // console.log('mmnnnbbvv')
            throw new Error(`Failed to send email: ${res.statusText}`);
        }

        return res
    }
    catch (error) {
        handleError(error, "Failed to send email");
    }
}