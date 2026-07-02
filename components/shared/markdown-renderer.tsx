import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;
  return <div className={cn("font-body text-text-secondary leading-relaxed", className)}>{renderMarkdown(content)}</div>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: string | number) => {
    if (currentList) {
      if (currentList.type === "ul") {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-text-secondary font-body space-y-2 mb-6">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-text-secondary font-body space-y-2 mb-6">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = (key: string | number) => {
    if (inTable && tableRows.length > 0) {
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator row
      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface/50 p-1 mb-6 shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border-default font-body font-bold text-text-primary">
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-semibold">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border-default/50 last:border-b-0 hover:bg-bg-alt/30 transition-colors font-body text-text-secondary">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3">{parseInlineMarkdown(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Table Row parsing
    if (line.startsWith("|")) {
      flushList(i);
      inTable = true;
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else {
      flushTable(i);
    }

    // Unordered list item
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const text = line.substring(2);
      if (!currentList || currentList.type !== "ul") {
        flushList(i);
        currentList = { type: "ul", items: [text] };
      } else {
        currentList.items.push(text);
      }
      continue;
    }

    // Ordered list item
    const matchOl = line.match(/^(\d+)\.\s(.*)/);
    if (matchOl) {
      const text = matchOl[2];
      if (!currentList || currentList.type !== "ol") {
        flushList(i);
        currentList = { type: "ol", items: [text] };
      } else {
        currentList.items.push(text);
      }
      continue;
    }

    // Non-list line, flush list if any
    flushList(i);

    // Empty line
    if (!line) {
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      const title = line.substring(3);
      const id = slugify(title);
      elements.push(
        <h2 key={i} id={id} className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-text-primary mt-10 mb-5 border-b border-border-default pb-3 scroll-mt-24">
          {title}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      const title = line.substring(4);
      const id = slugify(title);
      elements.push(
        <h3 key={i} id={id} className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-text-primary mt-8 mb-4 scroll-mt-24">
          {title}
        </h3>
      );
      continue;
    }


    // Horizontal Rule
    if (line === "---") {
      elements.push(<hr key={i} className="border-t border-border-default my-6" />);
      continue;
    }

    // Callout box: > [!IMPORTANT] or > [!TIP] or > [!WARNING] or > [!NOTE]
    if (line.startsWith("> [!")) {
      let type: "IMPORTANT" | "TIP" | "WARNING" | "NOTE" = "NOTE";
      if (line.includes("IMPORTANT")) type = "IMPORTANT";
      else if (line.includes("TIP")) type = "TIP";
      else if (line.includes("WARNING")) type = "WARNING";

      const contentLines: string[] = [];
      i++; // Move past header line
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const text = lines[i].trim();
        const cleanContent = text.replace(/^>\s?/, "");
        contentLines.push(cleanContent);
        i++;
      }
      i--; // Step back to balance loop

      const blockContent = contentLines.join(" ");

      let borderClass = "border-l-accent-primary border-y-border-default/50 border-r-border-default/50 bg-accent-primary/5 dark:bg-accent-primary/10 text-text-secondary";
      let titleColor = "text-accent-primary";
      if (type === "IMPORTANT") {
        borderClass = "border-l-state-error border-y-border-default/50 border-r-border-default/50 bg-state-error/5 dark:bg-state-error/10 text-text-secondary";
        titleColor = "text-state-error";
      } else if (type === "TIP") {
        borderClass = "border-l-state-success border-y-border-default/50 border-r-border-default/50 bg-state-success/5 dark:bg-state-success/10 text-text-secondary";
        titleColor = "text-state-success";
      } else if (type === "WARNING") {
        borderClass = "border-l-state-warning border-y-border-default/50 border-r-border-default/50 bg-state-warning/5 dark:bg-state-warning/10 text-text-secondary";
        titleColor = "text-state-warning";
      }

      elements.push(
        <div key={i} className={cn("p-5 rounded-2xl border-l-4 border-y border-r mb-6 shadow-sm", borderClass)}>
          <span className={cn("text-xs font-bold font-body uppercase tracking-wider block mb-1.5", titleColor)}>
            {type}
          </span>
          <p className="text-sm sm:text-base font-body font-medium leading-relaxed">
            {parseInlineMarkdown(blockContent)}
          </p>
        </div>
      );
      continue;
    }

    // Standard Paragraph
    elements.push(
      <p key={i} className="text-sm sm:text-base text-text-secondary leading-relaxed font-body mb-6">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  flushList("final");
  flushTable("final");

  return elements;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  currentText = currentText
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\%/g, "%")
    .replace(/\\times/g, "×")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 / $2")
    .replace(/\$\$/g, "");

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf("**");
    const linkIndex = currentText.indexOf("[");

    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(<span key={key++}>{currentText}</span>);
      break;
    }

    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      if (boldIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, boldIndex)}</span>);
      }
      const closeBoldIndex = currentText.indexOf("**", boldIndex + 2);
      if (closeBoldIndex !== -1) {
        const boldText = currentText.substring(boldIndex + 2, closeBoldIndex);
        parts.push(<strong key={key++} className="font-extrabold text-text-primary">{boldText}</strong>);
        currentText = currentText.substring(closeBoldIndex + 2);
      } else {
        parts.push(<span key={key++}>**</span>);
        currentText = currentText.substring(boldIndex + 2);
      }
    } else {
      if (linkIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, linkIndex)}</span>);
      }
      const closeSquareIndex = currentText.indexOf("]", linkIndex);
      const openParenIndex = currentText.indexOf("(", closeSquareIndex);
      const closeParenIndex = currentText.indexOf(")", openParenIndex);

      if (closeSquareIndex !== -1 && openParenIndex === closeSquareIndex + 1 && closeParenIndex !== -1) {
        const linkText = currentText.substring(linkIndex + 1, closeSquareIndex);
        const href = currentText.substring(openParenIndex + 1, closeParenIndex);

        const isAnchor = href.startsWith("#") || href.startsWith("/") || href.startsWith("http");
        if (isAnchor) {
          parts.push(
            <Link key={key++} href={href} className="text-accent-primary hover:underline font-semibold transition-colors duration-200">
              {linkText}
            </Link>
          );
        } else {
          parts.push(<span key={key++}>{linkText}</span>);
        }
        currentText = currentText.substring(closeParenIndex + 1);
      } else {
        parts.push(<span key={key++}>[</span>);
        currentText = currentText.substring(linkIndex + 1);
      }
    }
  }

  return parts;
}
