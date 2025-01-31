import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const getFiles = async (folder: string) => {

    console.log(folder)
    const files = await fetch(
        `/api/file?folder=${encodeURIComponent(folder)}`
    );
    console.log(files)

    const applicationId = encodeURIComponent(folder)

    const data = await files.json();
    console.log(data);
    return data;
};


//@ts-ignore
export const postFiles = async (fileData) => {

    const files = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
    });

    return files;
};

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const renameFile = async ({
    url,
    oldNameFile,
    newFileName,
    folderName,
    path
}: RenameProps) => {

    try {
        const response = await fetch(`/api/file`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folder: url,
                oldFileName: oldNameFile,
                newFileName: newFileName,
                folderName: folderName
            }),
        })


        return parseStringify({ status: "success" });
    }
    catch (error) {
        handleError(error, "Failed to rename file");
    }

}

export const deleteFile = async (
    {
        url,
        fileName,
        folderName,
        path
    }: DeleteProps
) => {

    try {
        const response = await fetch(`/api/file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folder: url,
                fileName: fileName,
                folderName: folderName
            }),
        })


        return parseStringify({ status: "success" });
    }
    catch (error) {
        handleError(error, "Failed to rename file");
    }
}

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
            throw new Error(`Failed to send email: ${res.statusText}`);
        }

        return res
    }
    catch (error) {
        handleError(error, "Failed to send email");
    }
}