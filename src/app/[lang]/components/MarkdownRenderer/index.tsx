// components/MarkdownRenderer.tsx
import React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processor = unified()
    .use(remarkParse)
    /* @ts-ignore */
    .use(remarkReact, {
      createElement: React.createElement,
      Fragment: React.Fragment,
    });

  const result = processor.processSync(content).result;

  /* @ts-ignore */
  return <div>{result}</div>;
};

export default MarkdownRenderer;
