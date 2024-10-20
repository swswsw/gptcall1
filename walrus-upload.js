import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Function to upload a file to Walrus using the /v1/store endpoint.
 *
 * @param {string} filePath - The path to the file to upload.
 * @param {string} basePublisherUrl - The base URL of the Walrus publisher.
 * @param {number} numEpochs - Number of epochs for storage.
 * @returns {Promise<Object|null>} The result of the upload or null if an error occurred.
 */
export async function uploadFile(filePath, basePublisherUrl, numEpochs) {
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
            return result;
        } else {
            console.error('Failed to upload the file. HTTP status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

// Configuration parameters
// const filePath = './public/encrypted_contract.pdf';  // Upload encrypted.pdf here
// const basePublisherUrl = 'https://walrus-testnet-publisher.stakin-nodes.com'; 
// const numEpochs = 100;  // Needs to be 100. 1 throws error

// Call the upload function
//uploadFile(filePath, basePublisherUrl, numEpochs);


// Default configuration parameters
export const defaultConfig = {
    filePath: './public/encrypted_contract.pdf',
    basePublisherUrl: 'http://publisher.testnet.sui.rpcpool.com:9001',
    numEpochs: 100
};