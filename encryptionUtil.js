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
const outputFilePath = './public/contract.pdf';
const encryptedFilePath = './public/encrypted_contract.pdf';
let password = 'password';

function generateEncryptionKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters[randomIndex];
  }
  console.log('Encryption Key:', key);
  return key;
}
  
password = generateEncryptionKey();

function outputEncryptedPdf(str) {
    createPdfFromString(str, outputFilePath, () => {
        encryptPdf(outputFilePath, encryptedFilePath, password, () => {
          console.log('Process completed successfully.');
          
        });
      });
    return password;
}

export { outputEncryptedPdf };


//outputEncryptedPdf(myString);