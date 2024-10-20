import fs from 'fs';
import fetch from 'node-fetch';// Ensure node-fetch is installed: npm install node-fetch

/**
 * Function to upload a file to Walrus using the /v1/store endpoint.
 *
 * @param {string} filePath - The path to the file to upload.
 * @param {string} basePublisherUrl - The base URL of the Walrus publisher.
 * @param {number} numEpochs - Number of epochs for storage.
 */
async function uploadFile(filePath, basePublisherUrl, numEpochs) {
    try {
        const inputFile = fs.readFileSync(filePath);  // Read the file content
        const fileName = filePath.split('/').pop();   // Extract the file name

        // Send the file via PUT request
        const response = await fetch(`${basePublisherUrl}/v1/store?epochs=${numEpochs}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileName}"`
            },
            body: inputFile
        });

        if (response.ok) {
            const result = await response.json();
            console.log('File uploaded successfully:', result);
        } else {
            console.error('Failed to upload the file. HTTP status:', response.status);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Configuration parameters
const filePath = './public/encrypted_contract.pdf';  // Upload encrypted.pdf here
const basePublisherUrl = 'https://publisher.walrus-testnet.walrus.space'; 
const numEpochs = 100;  // Needs to be 100. 1 throws error

// Call the upload function
uploadFile(filePath, basePublisherUrl, numEpochs);