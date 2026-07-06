"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { BlogPost, BlogSEO } from "@/lib/types";
import { TagInput } from "@/components/blog/tag-input";
import { ImageUploader } from "@/components/blog/image-uploader";
import { MarkdownEditor } from "@/components/blog/markdown-editor";

const CATEGORIES = [
  { key: "buying-guide", label: "Buying Guide" },
  { key: "selling-guide", label: "Selling Guide" },
  { key: "market-trends", label: "Market Trends" },
  { key: "investment", label: "Investment" },
  { key: "lifestyle", label: "Lifestyle" },
] as const;

const SUGGESTED_TAGS = [
  "Valuation",
  "Market ROI",
  "Mortgage Tips",
  "Hamptons Guide",
  "Luxury Sales",
  "First-time Buyer",
  "Interior Staging",
  "Tax Incentives"
];

export interface BlogFormProps {
  initialPost?: BlogPost | null;
  onSubmit: (
    postPayload: Omit<BlogPost, "id" | "publishedAt" | "reactions" | "author" | "authorId" | "authorRole"> & {
      status: "draft" | "pending" | "published";
    },
    submitStatus: "draft" | "pending" | "published"
  ) => Promise<void>;
  submitStatusType: "pending" | "published"; // 'pending' for user/agent reviews, 'published' for admins auto-publishing
  defaultCoverImage?: string;
}

export function BlogForm({
  initialPost,
  onSubmit,
  submitStatusType,
  defaultCoverImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
}: BlogFormProps) {
  // Form state
  const [title, setTitle] = React.useState(initialPost?.title || "");
  const [excerpt, setExcerpt] = React.useState(initialPost?.excerpt || "");
  const [category, setCategory] = React.useState<BlogPost["category"]>(
    initialPost?.category || "buying-guide"
  );
  const [coverImage, setCoverImage] = React.useState(initialPost?.coverImage || defaultCoverImage);
  const [content, setContent] = React.useState(initialPost?.content || "");

  // Comma-separated tags input state
  const [tagsInput, setTagsInput] = React.useState(initialPost?.tags.join(", ") || "");

  // SEO Form state
  const [seoTitle, setSeoTitle] = React.useState(initialPost?.seo.title || "");
  const [seoDescription, setSeoDescription] = React.useState(initialPost?.seo.metaDescription || "");
  const [seoKeywords, setSeoKeywords] = React.useState(initialPost?.seo.keywords.join(", ") || "");
  const [canonicalUrl, setCanonicalUrl] = React.useState(initialPost?.seo.canonicalUrl || "");
  const [noIndex, setNoIndex] = React.useState(!!initialPost?.seo.noIndex);
  const [ogTitle, setOgTitle] = React.useState(initialPost?.seo.ogTitle || "");
  const [ogDescription, setOgDescription] = React.useState(initialPost?.seo.ogDescription || "");
  const [ogImage, setOgImage] = React.useState(initialPost?.seo.ogImage || "");
  const [useCoverAsOg, setUseCoverAsOg] = React.useState(
    !initialPost || !initialPost.seo.ogImage || initialPost.seo.ogImage === initialPost.coverImage
  );

  // Sync state options
  const [syncTitle, setSyncTitle] = React.useState(
    !initialPost || !initialPost.seo.title || initialPost.seo.title === initialPost.title
  );
  const [syncDesc, setSyncDesc] = React.useState(
    !initialPost || !initialPost.seo.metaDescription || initialPost.seo.metaDescription === initialPost.excerpt
  );
  const [syncKeywords, setSyncKeywords] = React.useState(
    !initialPost || !initialPost.seo.keywords || initialPost.seo.keywords.join(", ") === initialPost.tags.join(", ")
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync state if initialPost changes
  React.useEffect(() => {
    if (initialPost) {
      Promise.resolve().then(() => {
        setTitle(initialPost.title);
        setExcerpt(initialPost.excerpt);
        setCategory(initialPost.category);
        setCoverImage(initialPost.coverImage);
        setContent(initialPost.content);
        setTagsInput(initialPost.tags.join(", ") || "");

        setSeoTitle(initialPost.seo.title || "");
        setSeoDescription(initialPost.seo.metaDescription || "");
        setSeoKeywords(initialPost.seo.keywords.join(", ") || "");
        setCanonicalUrl(initialPost.seo.canonicalUrl || "");
        setNoIndex(!!initialPost.seo.noIndex);
        setOgTitle(initialPost.seo.ogTitle || "");
        setOgDescription(initialPost.seo.ogDescription || "");
        setOgImage(initialPost.seo.ogImage || "");
        setUseCoverAsOg(
          !initialPost.seo.ogImage || initialPost.seo.ogImage === initialPost.coverImage
        );
        setSyncTitle(!initialPost.seo.title || initialPost.seo.title === initialPost.title);
        setSyncDesc(!initialPost.seo.metaDescription || initialPost.seo.metaDescription === initialPost.excerpt);
        setSyncKeywords(!initialPost.seo.keywords || initialPost.seo.keywords.join(", ") === initialPost.tags.join(", "));
      });
    }
  }, [initialPost]);

  const handleSubmit = async (e: React.FormEvent, submitStatus: "draft" | "pending" | "published") => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim() || !coverImage.trim()) {
      toast.warning("Missing Fields", {
        description: "Please populate the Title, Excerpt, Content, and Cover Image."
      });
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const seoKeywordsArr = seoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const seo: BlogSEO = {
      title: seoTitle.trim() || title.trim(),
      metaDescription: seoDescription.trim() || excerpt.trim().slice(0, 155),
      keywords: seoKeywordsArr.length > 0 ? seoKeywordsArr : tags,
      ogImage: useCoverAsOg ? coverImage.trim() : ogImage.trim() || coverImage.trim(),
      canonicalUrl: canonicalUrl.trim() || undefined,
      ogTitle: ogTitle.trim() || seoTitle.trim() || title.trim(),
      ogDescription: ogDescription.trim() || seoDescription.trim() || excerpt.trim().slice(0, 155),
      noIndex,
    };

    const postPayload = {
      title: title.trim(),
      slug: initialPost?.slug || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      category,
      tags,
      readTimeMinutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
      seo,
      status: submitStatus,
      isFeatured: initialPost?.isFeatured || false,
    };

    try {
      await onSubmit(postPayload, submitStatus);
    } catch (err) {
      console.error("Failed to submit form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 text-sm font-body">
      {/* Core Fields Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-accent-primary uppercase tracking-wider border-b border-border-default pb-1">
          Core details
        </h4>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary">Blog Title <span className="text-rose-500">*</span></label>
          <input
            type="text"
            required
            placeholder="e.g. Navigating the Hamptons Summer Market"
            value={title}
            onChange={(e) => {
              const val = e.target.value;
              setTitle(val);
              if (syncTitle) {
                setSeoTitle(val);
                setOgTitle(val);
              }
            }}
            className="w-full h-10 px-3.5 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary">Excerpt Summary <span className="text-rose-500">*</span></label>
          <textarea
            required
            rows={2}
            maxLength={160}
            placeholder="Enter a brief summary (150-160 characters for optimal search results)."
            value={excerpt}
            onChange={(e) => {
              const val = e.target.value;
              setExcerpt(val);
              if (syncDesc) {
                setSeoDescription(val);
                setOgDescription(val);
              }
            }}
            className="w-full p-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
          />
          <span className="text-[10px] text-text-muted float-right">{excerpt.length}/160 characters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-bold text-text-secondary">Category <span className="text-rose-500">*</span></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogPost["category"])}
              className="w-full h-10 px-3.5 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key} className="bg-bg-surface">{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <TagInput
              value={tagsInput}
              onChange={(val) => {
                setTagsInput(val);
                if (syncKeywords) {
                  setSeoKeywords(val);
                }
              }}
              label="Tags"
              labelInfo="(select preset or type & press Enter/comma)"
              placeholder="e.g. Valuation, Selling, Hacks"
              suggestions={SUGGESTED_TAGS}
            />
          </div>
        </div>

        <ImageUploader
          value={coverImage}
          onChange={(val) => {
            setCoverImage(val);
            if (useCoverAsOg) {
              setOgImage(val);
            }
          }}
          label="Cover Image"
          required
        />

        <MarkdownEditor
          value={content}
          onChange={setContent}
          label="Content Body"
          required
        />
      </div>

      {/* SEO Metadata Section */}
      <div className="space-y-6 pt-6 border-t border-border-default/45">
        <div>
          <h4 className="text-sm font-bold text-text-primary font-heading flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-accent-primary" />
            SEO Search Engine Optimization
          </h4>
          <p className="text-[11px] text-text-muted mt-1 leading-normal font-medium">
            RealHoms automates metadata mapping by default. Use the toggle switchboard below to override specific SEO and social parameters.
          </p>
        </div>

        {/* ─── Sync Control Switchboard ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-bg-alt/40 p-4 rounded-2xl border border-border-default/60">
          
          {/* Sync Title */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">Auto-Sync Title</span>
              <p className="text-[9px] text-text-muted leading-tight">Use article title for search & social</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={syncTitle}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSyncTitle(checked);
                  if (checked) {
                    setSeoTitle(title);
                    setOgTitle(title);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-bg-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-border-default after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-primary peer-checked:after:bg-white"></div>
            </label>
          </div>

          {/* Sync Description */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">Auto-Sync Desc</span>
              <p className="text-[9px] text-text-muted leading-tight">Use excerpt summary for metadata</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={syncDesc}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSyncDesc(checked);
                  if (checked) {
                    setSeoDescription(excerpt);
                    setOgDescription(excerpt);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-bg-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-border-default after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-primary peer-checked:after:bg-white"></div>
            </label>
          </div>

          {/* Sync Keywords */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">Auto-Sync Keywords</span>
              <p className="text-[9px] text-text-muted leading-tight">Use tags list for target keywords</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={syncKeywords}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSyncKeywords(checked);
                  if (checked) {
                    setSeoKeywords(tagsInput);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-bg-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-border-default after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-primary peer-checked:after:bg-white"></div>
            </label>
          </div>

          {/* Sync OG Image */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border-default shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text-primary block">Sync Social Image</span>
              <p className="text-[9px] text-text-muted leading-tight">Use cover photo for social cards</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={useCoverAsOg}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUseCoverAsOg(checked);
                  if (checked) {
                    setOgImage(coverImage);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-bg-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-border-default after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-primary peer-checked:after:bg-white"></div>
            </label>
          </div>

        </div>

        {/* ─── Google SERP Visual Preview ─── */}
        <div className="border border-border-default rounded-2xl p-5 bg-[#0F172A] text-left shadow-lg select-none space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Google Search Preview (Live)
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-normal truncate leading-tight">
              realhoms.com/blogs/{(initialPost?.slug || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")) || "article-slug"}
            </div>
            <div className="text-[17px] text-[#8ab4f8] hover:underline font-normal font-sans leading-snug cursor-pointer truncate">
              {seoTitle.trim() || title.trim() || "Untitled Blog Post"}
            </div>
            <div className="text-sm text-slate-300 leading-normal font-normal line-clamp-2 max-w-2xl font-sans">
              {seoDescription.trim() || excerpt.trim() || "No meta description has been specified. Search engines will automatically scrape the article body..."}
            </div>
          </div>
        </div>

        {/* ─── Custom SEO Overrides ─── */}
        <div className="space-y-4">
          
          {/* Custom Titles override */}
          {!syncTitle && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-border-default/80 bg-bg-alt/10 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">SEO Meta Title</label>
                <input
                  type="text"
                  placeholder="Custom browser title tag override"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">Social OG Title</label>
                <input
                  type="text"
                  placeholder="Social title card shown when shared"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Custom Descriptions override */}
          {!syncDesc && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-border-default/80 bg-bg-alt/10 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">SEO Meta Description</label>
                <textarea
                  rows={2}
                  maxLength={160}
                  placeholder="Custom search description override"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">Social OG Description</label>
                <textarea
                  rows={2}
                  placeholder="Custom social description card shown when shared"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Custom Keywords override */}
          {!syncKeywords && (
            <div className="p-4 rounded-2xl border border-border-default/80 bg-bg-alt/10 animate-fade-in">
              <TagInput
                value={seoKeywords}
                onChange={setSeoKeywords}
                label="Target Search Keywords"
                labelInfo="(select preset or type & press Enter/comma)"
                placeholder="e.g. real estate ROI, mortgage tips"
                suggestions={SUGGESTED_TAGS}
              />
            </div>
          )}

          {/* Custom OG Image override */}
          {!useCoverAsOg && (
            <div className="p-4 rounded-2xl border border-border-default/80 bg-bg-alt/10 animate-fade-in">
              <ImageUploader
                value={ogImage}
                onChange={setOgImage}
                label="Custom Social Share (OG) Preview Image"
              />
            </div>
          )}

          {/* Shared always-on settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary">Canonical URL</label>
              <input
                type="text"
                placeholder="Cross-site canonical link tag reference"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
              />
            </div>

            {/* Indexing Option */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-elevated border border-border-default/60">
              <div>
                <span className="text-xs font-bold text-text-primary block">Search Engine Visibility</span>
                <span className="text-[10px] text-text-muted leading-tight">Enable indexing of this article in search engines.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={!noIndex}
                  onChange={(e) => setNoIndex(!e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-bg-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-border-default after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent-primary peer-checked:after:bg-white"></div>
              </label>
            </div>
          </div>

        </div>
      </div>

      {initialPost?.status === "published" && submitStatusType === "pending" && (
        <div className="p-3.5 rounded-xl border border-state-warning/20 bg-state-warning/10 text-state-warning text-xs font-semibold leading-relaxed">
          ⚠️ Note: This article is currently published and live. Saving changes will reset its status to <strong className="font-bold underline">Pending Approval</strong>, requiring moderator review before it is visible to the public again.
        </div>
      )}

      {/* Actions Panel */}
      <div className="flex gap-4 pt-6 border-t border-border-default/60">
        <Button
          type="button"
          disabled={isSubmitting}
          variant="outline"
          onClick={(e) => handleSubmit(e, "draft")}
          className="flex-1 h-11 border-border-default hover:bg-bg-elevated text-text-secondary rounded-full font-bold cursor-pointer disabled:opacity-50"
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={(e) => handleSubmit(e, submitStatusType)}
          className="flex-1 h-11 bg-accent-primary hover:bg-accent-primary-hov text-white rounded-full font-bold shadow-md cursor-pointer disabled:opacity-50"
        >
          {submitStatusType === "published" ? "Publish Immediately" : "Submit for Approval"}
        </Button>
      </div>
    </form>
  );
}
