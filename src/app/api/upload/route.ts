import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req: NextRequest, res: NextResponse) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as Blob) || null;
    console.log(formData)
    console.log(body)
    if (file) {
        /* 
         ownerId: 'emil@kowalski.com',
    accountId: '7',
    path: '/dashboard/stores/inspected/7',
    file: File {
      name: 'CHOCOLATE-MILK-SHAKE-5520.jpg',
      lastModified: 1733913752562,
      type: 'image/jpeg',
      size: 47359,
        */
        // const dir = path.join('C:', 'var', 'www', 'node', 'next-upload', 'public', 'uploads', `${body?.accountId}`);
        const dir = path.join(process.cwd(), 'public', 'uploads', `${body?.accountId}`);

        // Create the directory recursively
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return console.error(`Error creating directory: ${err.message}`);
            }
            console.log('Directory created successfully!');
        });
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        //@ts-ignore
        const fileName = `${uuidv4()}-${body?.file?.name}`;

        //@ts-nocheck
        fs.writeFileSync(
            path.resolve(dir, fileName),
            //@ts-ignore
            buffer
        );

        console.log("File saved successfully!");
        console.log("File name:", fileName);

    } else {
        return NextResponse.json({
            success: false,
        });
    }

    return NextResponse.json({
        success: true,
        name: (body.file as File).name,
    });
};


/**
 * Handles errors and sends a response with the error message.
 * @param {Error} error - The error object.
 * @param {string} message - A custom error message.
 * @param {NextApiResponse} res - The response object.
 */
//@ts-ignore
function handleError(error: Error, message: string, res: NextApiResponse) {
    console.error(message, error.message);
    res.status(500).json({ error: `${message}: ${error.message}` });
}

/**
 * Gets all files in the specified folder.
 * @param {string} folder - The subfolder name.
 * @returns {string[]} - Array of filenames.
 */
const getFiles = (folder: string): string[] => {
    const defaultDir = path.join("C:", "var", "www", "node", "next-upload", "public", "uploads");
    const dir = path.join(defaultDir, folder);

    if (!fs.existsSync(dir)) {
        throw new Error(`Directory ${dir} does not exist`);
    }

    return fs.readdirSync(dir);
};

/**
 * Renames a file in the specified folder.
 * @param {string} folder - The subfolder name.
 * @param {string} oldFileName - The current name of the file.
 * @param {string} newFileName - The new name for the file.
 */
const renameFile = (folder: string, oldFileName: string, newFileName: string) => {
    const defaultDir = path.join("C:", "var", "www", "node", "next-upload", "public", "uploads");
    const oldFilePath = path.join(defaultDir, folder, oldFileName);
    const newFilePath = path.join(defaultDir, folder, newFileName);

    if (!fs.existsSync(oldFilePath)) {
        throw new Error(`File ${oldFileName} does not exist`);
    }

    fs.renameSync(oldFilePath, newFilePath);
};

/**
 * Deletes a file in the specified folder.
 * @param {string} folder - The subfolder name.
 * @param {string} fileName - The name of the file to delete.
 */
const deleteFile = (folder: string, fileName: string) => {
    const defaultDir = path.join("C:", "var", "www", "node", "next-upload", "public", "uploads");
    const filePath = path.join(defaultDir, folder, fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${fileName} does not exist`);
    }

    fs.unlinkSync(filePath);
};

/**
 * Next.js API route handler to handle file operations.
 */

//@ts-ignore
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    try {
        const { folder, oldFileName, newFileName, fileName } = req.body;

        switch (method) {
            case "GET":
                // Get a list of files in the specified folder
                if (!folder) {
                    return res.status(400).json({ error: "Folder is required" });
                }
                const files = getFiles(folder);
                return res.status(200).json({ files });

            case "POST":
                // Rename a file
                if (!folder || !oldFileName || !newFileName) {
                    return res.status(400).json({ error: "Folder, oldFileName, and newFileName are required" });
                }
                renameFile(folder, oldFileName, newFileName);
                return res.status(200).json({ message: `File renamed to ${newFileName}` });

            case "DELETE":
                // Delete a file
                if (!folder || !fileName) {
                    return res.status(400).json({ error: "Folder and fileName are required" });
                }
                deleteFile(folder, fileName);
                return res.status(200).json({ message: `File ${fileName} deleted successfully` });

            default:
                res.setHeader("Allow", ["GET", "POST", "DELETE"]);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        handleError(error, "An error occurred during file operations", res);
    }
}