"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText, Plus, FileEdit, Trash2, Eye, BarChart3, Search, HelpCircle
} from "lucide-react";
import { useBlogs } from "@/lib/blog-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types";
import { useRouter } from "next/navigation";

export function AgentBlogsClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { posts, deletePost } = useBlogs();

  // Search posts
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter posts authored by current agent
  const agentPosts = React.useMemo(() => {
    return posts.filter((p) => p.authorId === currentUser?.id);
  }, [posts, currentUser]);

  const filteredAgentPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return agentPosts;
    const q = searchQuery.toLowerCase().trim();
    return agentPosts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [agentPosts, searchQuery]);

  // Aggregate reactions analytics
  const stats = React.useMemo(() => {
    const published = agentPosts.filter((p) => p.status === "published").length;
    const pending = agentPosts.filter((p) => p.status === "pending").length;

    const emojiBreakdown: Record<string, number> = {
      "🔥": 0, "❤️": 0, "👏": 0, "💡": 0, "😮": 0, "🚀": 0
    };

    let totalReacts = 0;
    let totalViews = 0;
    agentPosts.forEach((p) => {
      totalViews += p.views || 0;
      if (p.reactions) {
        Object.entries(p.reactions).forEach(([emoji, count]) => {
          totalReacts += count;
          if (emojiBreakdown[emoji] !== undefined) {
            emojiBreakdown[emoji] += count;
          }
        });
      }
    });

    return {
      total: agentPosts.length,
      published,
      pending,
      reactions: totalReacts,
      views: totalViews,
      breakdown: emojiBreakdown
    };
  }, [agentPosts]);

  // Handle open compose
  const handleOpenCompose = () => {
    router.push("/agent/blogs/new");
  };

  // Handle open edit
  const handleOpenEdit = (post: BlogPost) => {
    router.push(`/agent/blogs/${post.id}/edit`);
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Delete this blog post? This will permanently archive it from all active columns.")) {
      try {
        await deletePost(postId);
        toast.success("Blog post deleted successfully");
      } catch {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
            Agent Blog Console
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Draft advisory blogs for buyers and sellers, customize SEO metadata tags, and audit reader reaction analytics.
          </p>
        </div>

        <Button onClick={handleOpenCompose} className="h-10 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white font-bold gap-1.5 self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Write Advisory Post</span>
        </Button>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Authored Columns</span>
            <span className="text-3xl font-extrabold font-heading text-text-primary mt-2">{stats.total}</span>
            <span className="text-[10px] text-text-muted mt-4">Drafts, pending and active files</span>
          </div>
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm flex flex-col justify-between">
            <span className="text-3xl font-extrabold font-heading text-emerald-400 mt-2">{stats.published}</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Active & Published</span>
            <span className="text-[10px] text-text-muted mt-4">Visible to site visitors</span>
          </div>
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Pending Approvals</span>
            <span className="text-3xl font-extrabold font-heading text-amber-400 mt-2">{stats.pending}</span>
            <span className="text-[10px] text-text-muted mt-4">Under review by administrators</span>
          </div>
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Total Page Views</span>
            <span className="text-3xl font-extrabold font-heading text-sky-400 mt-2">{stats.views}</span>
            <span className="text-[10px] text-text-muted mt-4">Cumulative traffic across all posts</span>
          </div>
        </div>

        {/* Reaction Breakdown metrics */}
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-pink-400 animate-pulse" />
            Reader Engagement Audit ({stats.reactions} reacts)
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-xs font-semibold">
            {Object.entries(stats.breakdown).map(([emoji, count]) => (
              <div key={emoji} className="p-2 bg-bg-elevated/60 border border-border-default/45 rounded-xl">
                <span className="text-base block mb-0.5">{emoji}</span>
                <span className="text-text-primary font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Directory & Registry Table */}
      <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-default/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-heading text-base font-bold text-text-primary">Articles Registry</h3>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-faint" />
            <input
              type="text"
              placeholder="Search posts by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 text-xs rounded-full border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
            />
          </div>
        </div>

        {filteredAgentPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-bg-alt/40 border-b border-border-default text-text-muted font-bold font-body">
                  <th className="p-4">Cover & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Views</th>
                  <th className="p-4">Reactions</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgentPosts.map((post) => {
                  const reactionsCount = post.reactions ? Object.values(post.reactions).reduce((a, b) => a + b, 0) : 0;
                  return (
                    <tr key={post.id} className="border-b border-border-default/50 hover:bg-bg-alt/30 transition-colors font-body text-text-secondary">
                      <td className="p-4 flex items-center gap-3 min-w-[280px]">
                        <img src={post.coverImage} alt={post.title} className="h-12 w-16 object-cover rounded-lg border border-border-default bg-bg-elevated" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-text-primary truncate max-w-xs">{post.title}</h4>
                          <span className="text-[10px] text-text-faint truncate block mt-0.5">Keywords: {post.seo.keywords.slice(0, 3).join(", ") || "None"}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{post.category.replace("-", " ")}</td>
                      <td className="p-4 text-center font-bold text-text-primary">{post.views || 0}</td>
                      <td className="p-4 font-bold text-text-primary">{reactionsCount} reacts</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                            post.status === "published" && "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                            post.status === "pending" && "text-amber-400 bg-amber-500/10 border-amber-500/20",
                            post.status === "draft" && "text-slate-400 bg-slate-500/10 border-slate-500/20",
                            post.status === "rejected" && "text-rose-400 bg-rose-500/10 border-rose-500/20"
                          )}>
                            {post.status || "published"}
                          </span>

                          {post.status === "rejected" && post.rejectionReason && (
                            <div className="group relative">
                              <HelpCircle className="h-4 w-4 text-rose-400 hover:text-rose-300 cursor-pointer" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-bg-surface border border-border-default/80 text-text-secondary rounded-lg p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-[11px] leading-relaxed z-15">
                                <div className="font-bold text-rose-400 mb-0.5">Admin feedback:</div>
                                {post.rejectionReason}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-text-muted">{new Date(post.publishedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-1">
                        <div className="inline-flex gap-2">
                          {post.status === "published" && (
                            <Link href={`/blogs/${post.slug}`} target="_blank" className="h-8 w-8 rounded-lg bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-muted hover:text-accent-primary transition-colors font-semibold">
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <button onClick={() => handleOpenEdit(post)} className="h-8 w-8 rounded-lg bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-muted hover:text-accent-primary transition-colors cursor-pointer">
                            <FileEdit className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="h-8 w-8 rounded-lg bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-muted hover:text-rose-500 transition-colors cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted font-body">
            <FileText className="h-10 w-10 text-border-default mx-auto mb-2" />
            <p className="font-bold">No posts cataloged</p>
            <p className="text-xs text-text-faint mt-0.5">Compose advisory columns by clicking the button above to begin engaging leads.</p>
          </div>
        )}
      </div>
    </div>
  );
}
