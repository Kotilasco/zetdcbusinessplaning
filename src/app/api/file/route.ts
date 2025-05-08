//@ts-nocheck
import { NextApiRequest } from "next";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime";
import { v4 as uuidv4 } from 'uuid';
import httpntlm from "httpntlm";



export const GET = async (req: NextRequest) => {
  //  console.log("API route /api/file was hit by:", req.headers);

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "";
    console.log("Folder:", folder);
    if (!folder) {
        return new NextResponse(
          JSON.stringify({ message: "Folder parameter is missing" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );}

    try {
        //const defaultDir = path.join("C:", "var", "www", "node", "next-upload", "public", "uploads");
        const defaultDir = path.join(process.cwd(), 'public', 'uploads');
        const dir = folder ? path.join(defaultDir, folder) : defaultDir;

if (!fs.existsSync(dir)) {
  throw new Error(`Directory ${dir} does not exist`);
}

      //  console.log("Directory:", dir);

        //  const files = fs.readdirSync(dir);
        // Read all files in the folder
        const files = fs.readdirSync(dir).map((fileName) => {
            const filePath = path.join(dir, fileName);
            const stats = fs.statSync(filePath); // Get file metadata
            const type = mime.getType(fileName)
            return {
                id: uuidv4(),
                name: fileName, // File name
                folder: folder,
                url: `uploads/${folder}/${fileName}`, // File URL (for downloading)
                extension: path.extname(fileName).replace(".", ""), // File extension (without the dot)
                type: type?.split("/")[0], // File MIME type
                size: stats.size, // File size in bytes
                createdAt: stats.birthtime, // Date created
                updatedAt: stats.mtime, // Date last modified
                owner: "zetdc", // Placeholder (replace with actual owner logic, e.g., user ID)
                accountId: "12345", // Placeholder (replace with actual account ID logic)
            };
        });

       // console.log("Files:", files);


        return new NextResponse(JSON.stringify({ message: "Files read successfully", documents: files }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error reading files" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};


export const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { folder, oldFileName, newFileName, folderName } = body;

        if (!folder || !oldFileName || !newFileName) {
            return new NextResponse(
                JSON.stringify({
                    message: "Folder, oldFileName, and newFileName are required",
                }),
                { status: 400 }
            );
        }

        const defaultDir = path.join(process.cwd(), "public");
        const oldFilePath = path.join(defaultDir, folder);
        const newPath = folder.replace(/[^/]+$/, newFileName);
        const newFilePath = path.join(defaultDir, newPath);

        console.log(oldFilePath)
        console.log(newFilePath)
        if (!fs.existsSync(oldFilePath)) {
            return new NextResponse(
                JSON.stringify({ message: `File ${oldFileName} does not exist` }),
                { status: 404 }
            );
        }

        fs.renameSync(oldFilePath, newFilePath);

        // return NextResponse.redirect(new URL(`/dashboard/stores/inspected/${folderName}`));

        return new NextResponse(
            JSON.stringify({
                message: `File renamed successfully from ${oldFileName} to ${newFileName}`, success: true
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ message: "Error renaming file" }),
            { status: 500 }
        );
    }
};

// DELETE: Delete a file
export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { folder, fileName, folderName } = body;

        if (!folder || !fileName) {
            return new NextResponse(
                JSON.stringify({ message: "Folder and fileName are required" }),
                { status: 400 }
            );
        }

        const defaultDir = path.join(process.cwd(), "public");
        const filePath = path.join(defaultDir, folder);

        if (!fs.existsSync(filePath)) {
            return new NextResponse(
                JSON.stringify({ message: `File ${fileName} does not exist` }),
                { status: 404 }
            );
        }
        console.log(filePath)

        fs.unlinkSync(filePath);

        //  return NextResponse.redirect(new URL(`/dashboard/stores/inspected/${folderName}`));

        /* return new NextResponse(
            JSON.stringify({ message: `File ${fileName} deleted successfully`, success: true }),
            {
                status: 200, headers: {
                    'Cache-Control': `public, s-maxage=60, stale-while-revalidate=60`,
                },
            }
        ); */
        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        /* return new NextResponse(
            JSON.stringify({ message: "Error deleting file" }),
            { status: 500 }
        ); */
        return NextResponse.json({
            success: false,
        });
    }
};

/* export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Parse the request body to get the path
        const { path } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Revalidate the specified path
        await res.revalidate(path);

        return NextResponse.json({ revalidated: true, path });
    } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
    }
} */


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
            //@ts-ignore
            (err, response) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
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