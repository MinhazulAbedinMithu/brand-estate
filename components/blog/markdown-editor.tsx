"use client";

import * as React from "react";
import { 
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, 
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon, 
  Eye, Edit3, Columns, AlertCircle, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Draft your article content...",
  label = "Content Body",
  required = false
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = React.useState<"write" | "preview" | "split">("write");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown tags at cursor selection
  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = prefix + (selectedText || "text") + suffix;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Reposition cursor and restore focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText || "text").length
      );
    }, 50);
  };

  // Preset templates
  const insertTable = () => {
    const tableTemplate = "\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |\n";
    insertMarkdown(tableTemplate);
  };

  const insertCallout = () => {
    insertMarkdown("\n> [!IMPORTANT]\n> ");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-text-secondary">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Tab Selector */}
        <div className="inline-flex rounded-lg border border-border-default/60 bg-bg-elevated/45 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer",
              activeTab === "write" 
                ? "bg-bg-surface text-accent-primary shadow-sm" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer",
              activeTab === "preview" 
                ? "bg-bg-surface text-accent-primary shadow-sm" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={cn(
              "hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer",
              activeTab === "split" 
                ? "bg-bg-surface text-accent-primary shadow-sm" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Columns className="h-3 w-3" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      <div className={cn(
        "rounded-2xl border border-border-default bg-bg-base overflow-hidden flex flex-col focus-within:border-accent-primary transition-colors",
        activeTab === "split" && "md:max-w-none md:w-full"
      )}>
        {/* Formatting Toolbar - only visible in write/split mode */}
        {activeTab !== "preview" && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-bg-alt/40 border-b border-border-default/60">
            <button
              type="button"
              title="Bold text"
              onClick={() => insertMarkdown("**", "**")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Italic text"
              onClick={() => insertMarkdown("*", "*")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <span className="h-4 w-px bg-border-default/60 mx-1" />
            <button
              type="button"
              title="Heading 2"
              onClick={() => insertMarkdown("## ")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => insertMarkdown("### ")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <Heading3 className="h-3.5 w-3.5" />
            </button>
            <span className="h-4 w-px bg-border-default/60 mx-1" />
            <button
              type="button"
              title="Unordered list"
              onClick={() => insertMarkdown("* ")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Ordered list"
              onClick={() => insertMarkdown("1. ")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Quote"
              onClick={() => insertMarkdown("> ")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Callout Box"
              onClick={insertCallout}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <AlertCircle className="h-3.5 w-3.5" />
            </button>
            <span className="h-4 w-px bg-border-default/60 mx-1" />
            <button
              type="button"
              title="Insert Link"
              onClick={() => insertMarkdown("[", "](url)")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Insert Image"
              onClick={() => insertMarkdown("![Image Alt](", ")")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Insert Table"
              onClick={insertTable}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="LaTeX Math Formula"
              onClick={() => insertMarkdown("$$ ", " $$")}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer ml-auto"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-primary animate-pulse" />
            </button>
          </div>
        )}

        {/* Editor Areas */}
        <div className={cn(
          "grid grid-cols-1 divide-y md:divide-y-0 border-t border-border-default/20",
          activeTab === "split" && "md:grid-cols-2 md:divide-x divide-border-default"
        )}>
          {/* Write Textarea */}
          {(activeTab === "write" || activeTab === "split") && (
            <textarea
              ref={textareaRef}
              required={required}
              rows={12}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-4 bg-transparent text-text-primary outline-none font-mono text-xs leading-relaxed resize-y border-0 focus:ring-0 focus:ring-offset-0 focus:outline-none"
            />
          )}

          {/* Preview Panel */}
          {(activeTab === "preview" || activeTab === "split") && (
            <div className={cn(
              "w-full p-5 bg-bg-alt/10 overflow-y-auto max-h-[30rem] custom-scrollbar prose dark:prose-invert max-w-none text-xs leading-relaxed",
              activeTab === "preview" ? "min-h-[16rem]" : "h-[16rem] md:h-auto"
            )}>
              {value.trim() ? (
                renderMarkdown(value)
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-text-muted py-8 select-none">
                  <Eye className="h-8 w-8 mb-2 stroke-1" />
                  <p>Nothing to preview yet. Write some markdown content above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared Markdown Parser copy from detail-client ───────────────────────────────

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
          <ul key={`ul-${key}`} className="list-disc pl-5 text-text-secondary space-y-1 mb-4">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 text-text-secondary space-y-1 mb-4">
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
      const dataRows = tableRows.slice(2);
      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface p-0.5 mb-4 shadow-sm">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border-default font-bold text-text-primary">
                {headers.map((h, i) => (
                  <th key={i} className="p-2 font-semibold">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border-default/50 last:border-b-0 hover:bg-bg-alt/35 transition-colors text-text-secondary">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2">{parseInlineMarkdown(cell.trim())}</td>
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

    if (line.startsWith("|")) {
      flushList(i);
      inTable = true;
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else {
      flushTable(i);
    }

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

    flushList(i);

    if (!line) {
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base font-bold font-heading text-text-primary mt-6 mb-3 border-b border-border-default pb-1.5">
          {line.substring(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold font-heading text-text-primary mt-5 mb-2.5">
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    if (line === "---") {
      elements.push(<hr key={i} className="border-t border-border-default my-4" />);
      continue;
    }

    if (line.startsWith("> [!")) {
      let type = "NOTE";
      if (line.includes("IMPORTANT")) type = "IMPORTANT";
      else if (line.includes("TIP")) type = "TIP";
      else if (line.includes("WARNING")) type = "WARNING";

      const contentLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        contentLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      i--;

      const blockContent = contentLines.join(" ");
      let borderClass = "border-l-accent-primary bg-accent-primary/5 text-text-secondary";
      let titleColor = "text-accent-primary";
      if (type === "IMPORTANT") {
        borderClass = "border-l-state-error bg-state-error/5 text-text-secondary";
        titleColor = "text-state-error";
      } else if (type === "TIP") {
        borderClass = "border-l-state-success bg-state-success/5 text-text-secondary";
        titleColor = "text-state-success";
      } else if (type === "WARNING") {
        borderClass = "border-l-state-warning bg-state-warning/5 text-text-secondary";
        titleColor = "text-state-warning";
      }

      elements.push(
        <div key={i} className={cn("p-4 rounded-xl border-l-4 border-y border-r border-border-default/40 mb-4 shadow-sm", borderClass)}>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider block mb-1", titleColor)}>
            {type}
          </span>
          <p className="font-medium">
            {parseInlineMarkdown(blockContent)}
          </p>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={i} className="text-text-secondary leading-relaxed mb-4">
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
        parts.push(<strong key={key++} className="font-bold text-text-primary">{boldText}</strong>);
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
