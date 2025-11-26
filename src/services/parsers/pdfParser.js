/**
 * PDF Parser - Extracts text from PDF files using pdfjs-dist
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker file from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

/**
 * Parse a PDF file and extract text content
 * @param {File} file - The PDF file to parse
 * @returns {Promise<string>} The extracted text content
 */
export async function parsePdfFile(file) {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts = [];
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items, preserving line breaks
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      textParts.push(pageText);
    }
    
    // Join all pages with double line breaks
    return textParts.join('\n\n');
  } catch (error) {
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
}
