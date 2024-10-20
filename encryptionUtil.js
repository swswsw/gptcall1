//needs brew install qpdf

import PDFDocument from 'pdfkit';
import fs from 'fs';
import qpdf from 'node-qpdf';

// Function to create a PDF from a string
function createPdfFromString(inputString, outputFilePath, callback) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputFilePath);

  doc.pipe(writeStream);
  doc.text(inputString);
  doc.end();

  writeStream.on('finish', callback);
}

// Function to encrypt the PDF file using node-qpdf
function encryptPdf(inputFilePath, outputFilePath, password, callback) {
  const options = {
    keyLength: 256, // Use 256-bit encryption key
    password: password,
    outputFile: outputFilePath
  };

  qpdf.encrypt(inputFilePath, options, function (error) {
    if (error) {
      console.error('Error encrypting PDF:', error);
    } else {
      console.log('PDF encrypted successfully.');
      callback();
    }
  });
}

const myString = "Hello, this is a contract generated from GPT";
const outputFilePath = 'contract.pdf';
const encryptedFilePath = 'encrypted_contract.pdf';
const password = 'password';

function outputEncryptedPdf(str) {
    createPdfFromString(str, outputFilePath, () => {
        encryptPdf(outputFilePath, encryptedFilePath, password, () => {
          console.log('Process completed successfully.');
          
        });
      });
    return encryptedFilePath;
}

export { outputEncryptedPdf };


//outputEncryptedPdf(myString);