import "server-only";

// Import necessary modules
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Type definition for the function return type
type MarkdownContent = {
  content: string | Promise<string>;
  data: Record<string, any>; // For the front matter metadata
  error?: string;
};

// Async function to load Markdown file
async function getMarkdown(locale: string, slug: string): Promise<MarkdownContent> {
  const basePath = path.join(process.cwd(), 'markdown'); 
  const filePath = path.join(basePath, slug);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { content, data }; // Return both content and metadata
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return { content: '', data: {}, error: 'Failed to load markdown content' };
  }
}

export { getMarkdown };
