/**
 * EPUB Parser - Extracts text from EPUB files using epubjs
 */

import ePub from 'epubjs';

/**
 * Parse an EPUB file and extract text content
 * @param {File} file - The EPUB file to parse
 * @returns {Promise<string>} The extracted text content
 */
export async function parseEpubFile(file) {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the EPUB book
    const book = ePub(arrayBuffer);
    
    // Load the book's spine (reading order)
    await book.ready;
    
    const textParts = [];
    
    // Get all spine items (chapters/sections)
    const spine = await book.loaded.spine;
    
    // Extract text from each section
    for (const item of spine.items) {
      try {
        // Load the section
        const section = book.spine.get(item.href);
        
        // Get the section content
        const contents = await section.load(book.load.bind(book));
        
        // Extract text from the HTML content
        const doc = contents.ownerDocument || contents;
        const body = doc.body || doc.querySelector('body') || doc;
        
        // Get text content, preserving some structure
        const text = body.textContent || body.innerText || '';
        
        if (text.trim()) {
          textParts.push(text.trim());
        }
      } catch (sectionError) {
        console.warn(`Failed to parse EPUB section ${item.href}:`, sectionError);
        // Continue with other sections
      }
    }
    
    // Join all sections with double line breaks
    return textParts.join('\n\n');
  } catch (error) {
    throw new Error(`Failed to parse EPUB file: ${error.message}`);
  }
}
