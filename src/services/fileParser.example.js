/**
 * File Parser Service - Usage Examples
 */

import { parseFile, parseText } from './fileParser.js';

// Example 1: Parse an uploaded file
async function exampleParseFile(file) {
  try {
    const result = await parseFile(file);
    
    console.log('File parsed successfully!');
    console.log('File name:', result.fileName);
    console.log('File type:', result.fileType);
    console.log('Word count:', result.metadata.wordCount);
    console.log('Character count:', result.metadata.characterCount);
    console.log('Estimated read time:', result.metadata.estimatedReadTime, 'minutes');
    console.log('Chapters found:', result.structure.chapters.length);
    console.log('Paragraphs found:', result.structure.paragraphs.length);
    console.log('Content preview:', result.content.substring(0, 200) + '...');
    
    return result;
  } catch (error) {
    console.error('Error parsing file:', error.message);
    throw error;
  }
}

// Example 2: Parse pasted text
function exampleParseText() {
  const sampleText = `
Chapter 1: The Beginning

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore.

Chapter 2: The Middle

While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.
  `;
  
  try {
    const result = parseText(sampleText);
    
    console.log('Text parsed successfully!');
    console.log('Word count:', result.metadata.wordCount);
    console.log('Chapters found:', result.structure.chapters.length);
    console.log('Chapter titles:', result.structure.chapters.map(ch => ch.title));
    
    return result;
  } catch (error) {
    console.error('Error parsing text:', error.message);
    throw error;
  }
}

// Example 3: Handle file upload in React component
function ExampleFileUploadComponent() {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    try {
      const parsedText = await parseFile(file);
      
      // Use the parsed text in your app
      console.log('Ready to interpret with spirits!');
      console.log('Text length:', parsedText.content.length);
      
      // Pass to interpretation engine, display in UI, etc.
    } catch (error) {
      // Show error to user
      alert(error.message);
    }
  };
  
  return (
    <input 
      type="file" 
      accept=".txt,.pdf,.epub" 
      onChange={handleFileUpload}
    />
  );
}

// Example 4: Error handling
async function exampleErrorHandling() {
  // File too large
  try {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
    await parseFile(largeFile);
  } catch (error) {
    console.log('Expected error:', error.message);
    // "File size exceeds maximum of 10MB"
  }
  
  // Unsupported file type
  try {
    const invalidFile = new File(['data'], 'file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    await parseFile(invalidFile);
  } catch (error) {
    console.log('Expected error:', error.message);
    // "Unsupported file type. Please upload a TXT, PDF, or EPUB file."
  }
  
  // Empty text
  try {
    parseText('');
  } catch (error) {
    console.log('Expected error:', error.message);
    // "Text is empty"
  }
}

export {
  exampleParseFile,
  exampleParseText,
  ExampleFileUploadComponent,
  exampleErrorHandling
};
