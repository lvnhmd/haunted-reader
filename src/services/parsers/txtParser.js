/**
 * TXT Parser - Extracts text from plain text files
 */

/**
 * Parse a plain text file
 * @param {File} file - The text file to parse
 * @returns {Promise<string>} The extracted text content
 */
export async function parseTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        resolve(text);
      } catch (error) {
        reject(new Error(`Failed to parse TXT file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read TXT file'));
    };
    
    reader.readAsText(file);
  });
}
