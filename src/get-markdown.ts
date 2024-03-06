import "server-only";

// Import necessary modules
import fs from 'fs/promises';
import path from 'path';

// Type definition for the function return type
type MarkdownContent = {
  content: string | Promise<string>;
  error?: string;
};

// Async function to load Markdown file
async function getMarkdown(locale: string, slug: string): Promise<MarkdownContent> {
  const basePath = path.join(process.cwd(), 'markdown'); 
  const filePath = path.join(basePath, slug);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { content };
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return { content: '', error: 'Failed to load markdown content' };
  }
}

export { getMarkdown };
