import * as React from "react";
import { Scale, Clock, ArrowRight } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

interface LegalLayoutProps {
  title: string;
  description: string;
  content: string;
  updatedAt?: string | Date;
}

export function LegalLayout({ title, description, content, updatedAt }: LegalLayoutProps) {
  // Format Date safely
  const formattedDate = React.useMemo(() => {
    if (!updatedAt) return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const d = new Date(updatedAt);
    return isNaN(d.getTime()) 
      ? String(updatedAt)
      : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }, [updatedAt]);

  // Extract Heading 2 tags for the table of contents sidebar
  const headings = React.useMemo(() => {
    if (!content) return [];
    return content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.startsWith("## ") && !line.startsWith("### "))
      .map(line => {
        const text = line.substring(3).trim();
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        return { text, slug };
      });
  }, [content]);

  return (
    <div className="bg-bg-base min-h-screen text-text-primary">
      {/* ── Section 1: Hero Header ── */}
      <section className="relative overflow-hidden bg-bg-surface py-16 border-b border-border-default/45">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-dim border border-accent-primary/10 text-[10px] font-bold text-accent-primary uppercase tracking-widest">
            <Scale className="h-3 w-3" /> Legal Compliance Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto font-body leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted font-medium font-body pt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Updated: {formattedDate}</span>
          </div>
        </div>
      </section>

      {/* ── Section 2: Two Column Content Layout ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          
          {/* Sticky Navigation Sidebar (Desktop Only) */}
          <aside className="sticky top-24 hidden lg:block space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-3">Table of Contents</h4>
            <nav className="space-y-1">
              {headings.map((h) => (
                <a
                  key={h.slug}
                  href={`#${h.slug}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-text-secondary hover:text-accent-primary hover:bg-bg-alt transition-all duration-200 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary" />
                  <span className="truncate">{h.text}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Legal Content Card */}
          <article className="lg:col-span-3 rounded-3xl border border-border-default/60 bg-bg-surface p-6 sm:p-10 shadow-xs relative">
            {/* Render dynamically stored Markdown */}
            <MarkdownRenderer content={content} />
          </article>

        </div>
      </section>
    </div>
  );
}
