"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Calendar, Clock, ChevronLeft, ArrowRight, ThumbsUp, Loader2, Lock, Eye } from "lucide-react";
import { useBlogs } from "@/lib/blog-context";
import { useAuth } from "@/lib/auth-context";
import { BlogCard } from "@/components/shared/blog-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { cn } from "@/lib/utils";
import { agentsMock } from "@/src/mocks/agentsMock";
import { toast } from "sonner";

interface BlogDetailClientProps {
  slug: string;
}

const EMOJIS = ["🔥", "❤️", "👏", "💡", "😮", "🚀"];

export function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const { posts, reactToPost, trackBlogView, isLoading } = useBlogs();
  const { currentUser } = useAuth();
  const router = useRouter();

  // Track client-side clicked emojis to prevent spamming (or highlight selected)
  const [clickedEmojis, setClickedEmojis] = React.useState<Record<string, boolean>>({});

  const post = React.useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(`brand-estate-reacted-${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => {
          setClickedEmojis(parsed);
        });
      }
    } catch { }
  }, [slug]);

  React.useEffect(() => {
    if (!post?.id) return;
    
    const hasViewed = sessionStorage.getItem(`brand-estate-viewed-${post.id}`);
    if (hasViewed) return;

    trackBlogView(post.id)
      .then(() => {
        sessionStorage.setItem(`brand-estate-viewed-${post.id}`, "true");
      })
      .catch((e) => console.error("Failed to track blog view:", e));
  }, [post?.id, trackBlogView]);

  const handleReact = (emoji: string, postId: string) => {
    reactToPost(postId, emoji);
    const updated = { ...clickedEmojis, [emoji]: true };
    setClickedEmojis(updated);
    try {
      localStorage.setItem(`brand-estate-reacted-${slug}`, JSON.stringify(updated));
    } catch { }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-bg-base flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 text-accent-primary animate-spin" />
        <p className="text-sm font-semibold text-text-muted">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const matchingAgent = agentsMock.find(
    (a) =>
      a.name.toLowerCase() === post.author.name.toLowerCase() ||
      a.id === post.authorId ||
      post.authorRole === "agent"
  ) ?? null;

  const isNidVerified = currentUser
    ? (currentUser.role !== 'auth_user' || currentUser.nidStatus === 'verified')
    : false;

  const handleAgentProfileClick = (e: React.MouseEvent, agentSlug: string) => {
    if (!isNidVerified) {
      e.preventDefault();
      toast.error("NID Verification Required", {
        description: currentUser 
          ? "Please submit and verify NID in profile settings to view agent profiles."
          : "Please register and verify NID to view agent profiles.",
      });
    }
  };

  // Check access permission for drafts, pending, or rejected blogs
  const isAuthor = currentUser && currentUser.id === post.authorId;
  const isAdmin = currentUser && (currentUser.role === "admin" || currentUser.role === "super_admin");
  const isPublished = post.status === "published" || !post.status;

  if (!isPublished && !isAuthor && !isAdmin) {
    return (
      <div className="min-h-[70vh] bg-bg-base flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-state-error/10 border border-state-error/20 flex items-center justify-center text-state-error mb-4">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Access Restricted</h1>
        <p className="text-sm text-text-secondary max-w-md mb-6 font-body">
          This article is currently under review or in draft status. Only the author and moderators have permission to view it.
        </p>
        <Link
          href="/blogs"
          className="bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold font-body px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          Return to Blogs
        </Link>
      </div>
    );
  }

  // Related posts (same category first, up to 3 published, excluding current)
  const publishedPosts = posts.filter((p) => p.status === "published" && p.id !== post.id);
  let relatedPosts = publishedPosts.filter((p) => p.category === post.category);
  if (relatedPosts.length < 3) {
    const additional = publishedPosts.filter((p) => p.category !== post.category);
    relatedPosts = [...relatedPosts, ...additional].slice(0, 3);
  } else {
    relatedPosts = relatedPosts.slice(0, 3);
  }

  // Format published date
  const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg-base relative">
      {/* Moderation Status Banner */}
      {!isPublished && (
        <div className={cn(
          "w-full py-3 px-4 flex items-center justify-center gap-2 border-b text-xs font-bold font-body",
          post.status === "pending" && "bg-state-warning/10 text-state-warning border-state-warning/20",
          post.status === "rejected" && "bg-state-error/10 text-state-error border-state-error/20",
          post.status === "draft" && "bg-bg-elevated text-text-secondary border-border-default/60"
        )}>
          <Eye className="h-4 w-4 shrink-0" />
          <span>
            {post.status === "pending" && "Pending Moderator Review — This article is not yet published to the public."}
            {post.status === "rejected" && `Rejected by Admin — Reason: "${post.rejectionReason || "No details provided"}"`}
            {post.status === "draft" && "Draft Mode — Visible only to you."}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-body text-text-muted hover:text-accent-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Insights
          </Link>
        </div>

        {/* SECTION A: Article Header */}
        <div className="space-y-4 max-w-4xl">
          <span className="inline-flex bg-accent-primary/10 text-accent-primary border border-accent-primary/15 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider capitalize">
            {post.category.replace("-", " ")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Quick specs horizontal row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-text-secondary font-medium pt-2 border-t border-border-default/45">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent-primary" />
              Published: {publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-primary" />
              {post.readTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-accent-primary" />
              {post.views || 0} views
            </span>
          </div>
        </div>

        {/* SECTION B: Large Cover Image */}
        <div className="relative aspect-21/9 w-full rounded-3xl overflow-hidden border border-border-default/50 shadow-md">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* SECTION C: Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start pt-4">
          {/* Left Column (2/3 width) - Rich Content Reader */}
          <div className="lg:col-span-2 space-y-8">
            <article className="prose dark:prose-invert max-w-none">
              {renderMarkdown(post.content)}
            </article>

            {/* Premium Reactions Bar */}
            <div className="bg-bg-surface border border-border-default/60 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-accent-primary" />
                <h4 className="text-sm font-bold text-text-primary font-body uppercase tracking-wider">
                  How did you find this article?
                </h4>
              </div>
              <p className="text-xs text-text-secondary font-body font-medium">
                Tap on any reaction to express your thoughts and engage with this resource.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {EMOJIS.map((emoji) => {
                  const currentCount = post.reactions?.[emoji] || 0;
                  const isReacted = !!clickedEmojis[emoji];
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReact(emoji, post.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold font-body transition-all duration-200 cursor-pointer active:scale-90 select-none",
                        isReacted
                          ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
                          : "bg-bg-elevated/40 border-border-default/80 text-text-secondary hover:bg-bg-elevated hover:border-accent-primary/30 hover:text-accent-primary"
                      )}
                    >
                      <span className={cn("text-base transition-transform duration-200 hover:scale-125", isReacted && "animate-bounce")}>
                        {emoji}
                      </span>
                      <span>{currentCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags row */}
            <div className="pt-6 border-t border-border-default/45 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-bg-elevated/80 border border-border-default/60 text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column / Sticky Sidebar (1/3 width) */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Author Profile Card */}
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
              <h4 className="font-body text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-default pb-3">
                About the Author
              </h4>
              <div className={cn("space-y-4", (post.authorRole === "agent" || matchingAgent !== null) && !isNidVerified && "blur-md select-none pointer-events-none")}>
                <div className="flex items-center gap-3.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full border border-border-default object-cover"
                  />
                  <div>
                    {matchingAgent ? (
                      <Link
                        href={`/agents/${matchingAgent.slug}`}
                        onClick={(e) => handleAgentProfileClick(e, matchingAgent.slug)}
                        className="text-sm font-bold text-text-primary hover:text-accent-primary hover:underline transition-colors block cursor-pointer"
                      >
                        {post.author.name}
                      </Link>
                    ) : (
                      <h5 className="text-sm font-bold text-text-primary">{post.author.name}</h5>
                    )}
                    <span className="text-[10px] text-accent-primary font-bold uppercase tracking-wider block mt-0.5">
                      {post.author.role}
                    </span>
                  </div>
                </div>
                {post.author.bio && (
                  <p className="text-xs text-text-secondary leading-relaxed font-body font-medium">
                    {post.author.bio}
                  </p>
                )}
                {matchingAgent && (
                  <div className="pt-2 border-t border-border-default/40">
                    <Link
                      href={`/agents/${matchingAgent.slug}`}
                      onClick={(e) => handleAgentProfileClick(e, matchingAgent.slug)}
                      className="text-xs font-bold text-accent-primary hover:text-accent-primary-hov flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      View Agent Profile →
                    </Link>
                  </div>
                )}
              </div>

              {/* NID Lock Banner Overlay inside Author Profile Card */}
              {(post.authorRole === "agent" || matchingAgent !== null) && !isNidVerified && (
                <div className="absolute inset-0 z-10 bg-bg-surface/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                  <div className="h-8 w-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-1.5 shadow-sm animate-pulse">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-text-primary tracking-wide leading-none">Identity Locked</span>
                  <p className="text-[9px] text-text-muted mt-1 leading-snug max-w-[130px] mx-auto">
                    Verify NID in profile settings to view author details.
                  </p>
                </div>
              )}
            </div>

            {/* Social Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} />

            {/* Newsletter Subscription Card */}
            <NewsletterForm />
          </div>
        </div>

        {/* SECTION D: Recommended/Related Articles (Full Width grid) */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-border-default/45 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                Recommended for You
              </h3>
              <Link
                href="/blogs"
                className="group flex items-center gap-1.5 text-xs font-extrabold text-accent-primary hover:text-accent-primary-hov transition-colors"
              >
                All Articles
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Markdown Rendering Helpers ──────────────────────────────────────────────

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
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-text-primary mt-10 mb-5 border-b border-border-default pb-3">
          {line.substring(3)}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-text-primary mt-8 mb-4">
          {line.substring(4)}
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
