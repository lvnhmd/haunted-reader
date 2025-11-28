/**
 * File Parser Service - Orchestrates parsing of different file formats
 * Supports TXT, PDF, and EPUB files
 */

import { parseTxtFile } from './parsers/txtParser.js';
import { parsePdfFile } from './parsers/pdfParser.js';
import { parseEpubFile } from './parsers/epubParser.js';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported file types
const SUPPORTED_TYPES = {
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/epub+zip': 'epub'
};

/**
 * Validate file before parsing
 * @param {File} file - The file to validate
 * @throws {Error} If file is invalid
 */
function validateFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  // Check file type by MIME type or extension
  const fileType = file.type || '';
  const fileName = file.name || '';
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const isValidMimeType = Object.keys(SUPPORTED_TYPES).includes(fileType);
  const isValidExtension = ['txt', 'pdf', 'epub'].includes(extension);
  
  if (!isValidMimeType && !isValidExtension) {
    throw new Error(`Unsupported file type. Please upload a TXT, PDF, or EPUB file.`);
  }
}

/**
 * Detect text structure (chapters, sections, paragraphs)
 * @param {string} text - The text to analyze
 * @returns {Object} Structure information
 */
function detectStructure(text) {
  const lines = text.split('\n');
  const paragraphs = [];
  const chapters = [];
  const sections = [];
  
  let currentParagraph = '';
  let lineIndex = 0;
  
  // Common chapter markers
  const chapterPatterns = [
    /^chapter\s+\d+/i,
    /^chapter\s+[ivxlcdm]+/i,
    /^ch\.\s*\d+/i,
    /^\d+\.\s+/,
    /^part\s+\d+/i,
    /^section\s+\d+/i,
    /^[ivxlcdm]+\.\s+/i
  ];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line is a chapter marker
    const isChapter = chapterPatterns.some(pattern => pattern.test(trimmedLine));
    
    if (isChapter && trimmedLine.length < 100) {
      chapters.push({
        title: trimmedLine,
        lineIndex,
        charIndex: text.indexOf(line)
      });
    }
    
    // Build paragraphs (separated by empty lines)
    if (trimmedLine === '') {
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
    }
    
    lineIndex++;
  }
  
  // Add final paragraph if exists
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }
  
  return {
    chapters,
    sections,
    paragraphs
  };
}

/**
 * Calculate text metadata
 * @param {string} text - The text to analyze
 * @returns {Object} Metadata information
 */
function calculateMetadata(text) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const characterCount = text.length;
  
  // Estimate read time: average 200 words per minute
  const estimatedReadTime = Math.ceil(wordCount / 200);
  
  return {
    wordCount,
    characterCount,
    estimatedReadTime
  };
}

/**
 * Parse a file and extract text with structure
 * @param {File} file - The file to parse
 * @returns {Promise<Object>} Parsed text with structure and metadata
 */
export async function parseFile(file) {
  // Validate file
  validateFile(file);
  
  // Determine file type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;
  
  let fileType = SUPPORTED_TYPES[mimeType] || extension;
  
  // Parse based on file type
  let content;
  
  try {
    switch (fileType) {
      case 'txt':
        content = await parseTxtFile(file);
        break;
      case 'pdf':
        content = await parsePdfFile(file);
        break;
      case 'epub':
        content = await parseEpubFile(file);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    // Detect structure
    const structure = detectStructure(content);
    
    // Calculate metadata
    const metadata = calculateMetadata(content);
    
    return {
      content,
      structure,
      metadata,
      fileName: file.name,
      fileType,
      fileSize: file.size
    };
  } catch (error) {
    throw new Error(`The spirits couldn't read this file: ${error.message}`);
  }
}

/**
 * Parse text directly (without file upload)
 * @param {string} text - The text to parse
 * @returns {Object} Parsed text with structure and metadata
 */
export function parseText(text) {
  if (typeof text !== 'string') {
    throw new Error('No text provided');
  }
  
  if (text.length === 0) {
    throw new Error('Text is empty');
  }
  
  // Detect structure
  const structure = detectStructure(text);
  
  // Calculate metadata
  const metadata = calculateMetadata(text);
  
  return {
    content: text,
    structure,
    metadata,
    fileName: 'pasted-text',
    fileType: 'txt'
  };
}

export default {
  parseFile,
  parseText
};
