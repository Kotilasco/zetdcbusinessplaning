var postmark = require("postmark");

export const postMark = async () => {
    try {
        const client = new postmark.ServerClient("a6c5382e-1ea4-4b11-b660-c39d374f4120");
        console.log("kkk")
        await client.sendEmail({
            "From": "sender@example.org",
            "To": "sender@example.org",
            "Subject": "Hello from Postmark",
            "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
            "TextBody": "Hello from Postmark!",
            "MessageStream": "zetdc"
        });

        console.log("Email sent successfully!");
    } catch (error) {
        console.log(error)
        console.error("Error sending email:", error);
    }
};