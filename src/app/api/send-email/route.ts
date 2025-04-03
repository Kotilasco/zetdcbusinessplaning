//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import httpntlm from "httpntlm";

type EmailRequestBody = {
  recipientEmail: string;
  subject: string;
  message: string;
};

// Helper function to send email using httpntlm
async function sendEmail(
  url: string,
  username: string,
  password: string,
  domain: string,
  xmlRequest: string
): Promise<any> {
  return new Promise((resolve, reject) => {
   
    httpntlm.post(
      {
        url,
        username,
        password,
        domain,
        body: xmlRequest,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction:
            "http://schemas.microsoft.com/exchange/services/2006/messages/CreateItem",
        },
      },
      (err, response) => {
        if (err) {
          console.error("HTTPNTLM Error:", err);
          reject(err);
        } else {
          console.log("HTTP Response:", response.statusCode, response.body);
          resolve(response);
        }
      }
    );
  });
}

// API route handler
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const { recipientEmail, subject, message } = body as EmailRequestBody;

    // Validate the request body
    if (!recipientEmail || !subject || !message) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // Environment variables
    const username = process.env.EWS_USERNAME as string;
    const password = process.env.EWS_PASSWORD as string;
    const domain = process.env.EWS_DOMAIN || "";
    const url = process.env.EWS_URL as string;

    console.log(username, password, url);

    // SOAP request payload
    const xmlRequest = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
                     xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" 
                     xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        <soap:Body>
          <m:CreateItem MessageDisposition="SendAndSaveCopy" xmlns:msg="http://schemas.microsoft.com/exchange/services/2006/messages">
            <m:SavedItemFolderId>
              <t:DistinguishedFolderId Id="sentitems"/>
            </m:SavedItemFolderId>
            <m:Items>
              <t:Message>
                <t:Subject>${subject}</t:Subject>
                <t:Body BodyType="Text">${message}</t:Body>
                <t:ToRecipients>
                  <t:Mailbox>
                    <t:EmailAddress>${recipientEmail}</t:EmailAddress>
                  </t:Mailbox>
                </t:ToRecipients>
              </t:Message>
            </m:Items>
          </m:CreateItem>
        </soap:Body>
      </soap:Envelope>
    `;

    // Send the email
    const response = await sendEmail(
      url,
      username,
      password,
      domain,
      xmlRequest
    );

    console.log(response);

    // Return success response
    return new NextResponse(
      JSON.stringify({
        response: response.body,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      { status: 500 }
    );
  }
};

export const GET = () => {
  return NextResponse(
    JSON.stringify({ error: "GET method not allowed for this route." }),
    { status: 405 }
  );
};
