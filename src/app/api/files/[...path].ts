//@ts-nocheck

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Example: Add authentication check here
    /* const isAuthenticated = true; // Replace this with your actual authentication logic
    if (!isAuthenticated) {
        return res.status(403).json({ error: 'Unauthorized' });
    } */

    // Get the file path from the query
    const { path: filePath } = req.query;

    // Define the base directory
    const baseDir = path.join(process.cwd(), 'public');

    // Construct the full file path
    const fullPath = path.join(baseDir, ...filePath);

    // Check if the file exists
    if (fs.existsSync(fullPath)) {
        // Set appropriate headers
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(fullPath)}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Stream the file to the client
        fs.createReadStream(fullPath).pipe(res);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
}