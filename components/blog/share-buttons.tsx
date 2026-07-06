"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";

// Local SVG brand icons to avoid version conflicts in lucide-react
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = React.useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blogs/${slug}`;
    }
    return `https://realhoms.com/blogs/${slug}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const handleShare = (platform: "twitter" | "facebook" | "linkedin") => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    let shareUrl = "";

    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
    }
  };

  return (
    <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
      <h4 className="font-body text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-default pb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-accent-primary" />
        Share This Article
      </h4>
      <div className="flex flex-wrap gap-2">
        {/* Twitter */}
        <button
          onClick={() => handleShare("twitter")}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold border border-border-default hover:border-sky-400 hover:text-sky-500 hover:bg-sky-400/5 transition-all duration-300 cursor-pointer"
          aria-label="Share on Twitter"
        >
          <TwitterIcon className="h-3.5 w-3.5" />
          <span>Twitter</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare("facebook")}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold border border-border-default hover:border-blue-600 hover:text-blue-600 hover:bg-blue-600/5 transition-all duration-300 cursor-pointer"
          aria-label="Share on Facebook"
        >
          <FacebookIcon className="h-3.5 w-3.5" />
          <span>Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare("linkedin")}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold border border-border-default hover:border-blue-700 hover:text-blue-700 hover:bg-blue-700/5 transition-all duration-300 cursor-pointer"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon className="h-3.5 w-3.5" />
          <span>LinkedIn</span>
        </button>
      </div>

      {/* Copy Link Input */}
      <div className="relative flex items-center mt-3 pt-2">
        <input
          type="text"
          readOnly
          value={getUrl()}
          className="w-full text-[10px] font-mono text-text-secondary pr-10 pl-3 py-2 border border-border-default bg-bg-alt/75 rounded-lg select-all focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-md bg-bg-surface hover:bg-bg-elevated border border-border-default text-text-secondary hover:text-accent-primary transition-all cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-state-success animate-fade-in" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
