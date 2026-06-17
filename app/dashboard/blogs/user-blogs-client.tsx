"use client";

import * as React from "react";
import Link from "next/link";
import { 
  FileText, Plus, FileEdit, Trash2, Heart, FileCheck, RefreshCw, 
  HelpCircle, Eye, Globe 
} from "lucide-react";
import { useBlogs } from "@/lib/blog-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BlogForm } from "@/components/blog/blog-form";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types";

export function UserBlogsClient() {
  const { currentUser } = useAuth();
  const { posts, createPost, updatePost, deletePost } = useBlogs();
  
  // Sheet open state
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);

  // Filter posts authored by current logged-in user
  const userPosts = React.useMemo(() => {
    return posts.filter((p) => p.authorId === currentUser?.id);
  }, [posts, currentUser]);

  // Aggregate stats
  const stats = React.useMemo(() => {
    const published = userPosts.filter((p) => p.status === "published").length;
    const pending = userPosts.filter((p) => p.status === "pending").length;
    
    let totalReacts = 0;
    userPosts.forEach((p) => {
      if (p.reactions) {
        Object.values(p.reactions).forEach((count) => {
          totalReacts += count;
        });
      }
    });

    return {
      total: userPosts.length,
      published,
      pending,
      reactions: totalReacts,
    };
  }, [userPosts]);

  // Handle compose action
  const handleOpenCompose = () => {
    setEditingPost(null);
    setSheetOpen(true);
  };

  // Handle edit action
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setSheetOpen(true);
  };

  // Form Submit handler bridging BlogForm payload
  const handleBlogSubmit = async (
    formPayload: Omit<BlogPost, "id" | "publishedAt" | "reactions" | "author" | "authorId" | "authorRole">,
    submitStatus: "draft" | "pending" | "published"
  ) => {
    const author = {
      name: currentUser?.name || "Anonymous Member",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      role: "Premium Member",
      bio: `BrandEstate contributor since ${new Date(currentUser?.createdAt || "").toLocaleDateString()}`,
    };

    const finalPayload = {
      ...formPayload,
      author,
      authorId: currentUser?.id,
      authorRole: currentUser?.role,
      status: submitStatus,
    };

    try {
      if (editingPost) {
        await updatePost({
          ...editingPost,
          ...finalPayload,
        });
        toast.success("Blog updated successfully", {
          description: submitStatus === "pending" ? "Your revisions are now pending review." : "Saved as draft.",
        });
      } else {
        await createPost(finalPayload);
        toast.success("Blog post submitted", {
          description: submitStatus === "pending" ? "It is now pending admin review before publishing." : "Saved as draft.",
        });
      }
      setSheetOpen(false);
    } catch {
      toast.error("Failed to submit blog post");
    }
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
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
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
            My Authored Blogs
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Draft, preview, and manage your real estate insights. Users and Agents submitted blogs undergo moderator review.
          </p>
        </div>

        <Button onClick={handleOpenCompose} className="h-10 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white font-bold gap-1.5 self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Write Blog Post</span>
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Total Submissions</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">{stats.total}</span>
            <div className="h-9 w-9 rounded-xl bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-muted"><FileText className="h-4 w-4" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Published Articles</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400">{stats.published}</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><FileCheck className="h-4 w-4" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Pending Review</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-400">{stats.pending}</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><RefreshCw className="h-4 w-4 animate-spin-slow" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Accumulated Reactions</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-pink-400">{stats.reactions}</span>
            <div className="h-9 w-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400"><Heart className="h-4 w-4" /></div>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-default/50 flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-text-primary">Articles Directory</h3>
        </div>

        {userPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-bg-alt/40 border-b border-border-default text-text-muted font-bold font-body">
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Engagement</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((post) => {
                  const reactionsCount = post.reactions ? Object.values(post.reactions).reduce((a, b) => a + b, 0) : 0;
                  return (
                    <tr key={post.id} className="border-b border-border-default/50 hover:bg-bg-alt/30 transition-colors font-body text-text-secondary">
                      <td className="p-4 flex items-center gap-3 min-w-[280px]">
                        <img src={post.coverImage} alt={post.title} className="h-12 w-16 object-cover rounded-lg border border-border-default bg-bg-elevated" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-text-primary truncate max-w-xs">{post.title}</h4>
                          <span className="text-[10px] text-text-faint truncate block mt-0.5">Read Time: {post.readTimeMinutes} min</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{post.category.replace("-", " ")}</td>
                      <td className="p-4 text-text-muted">{new Date(post.publishedAt).toLocaleDateString()}</td>
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
                                <div className="font-bold text-rose-400 mb-0.5">Rejection reason:</div>
                                {post.rejectionReason}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-text-primary">{reactionsCount} reacts</td>
                      <td className="p-4 text-right space-x-1">
                        <div className="inline-flex gap-2">
                          {post.status === "published" && (
                            <Link href={`/blogs/${post.slug}`} target="_blank" className="h-8 w-8 rounded-lg bg-bg-elevated border border-border-default/60 flex items-center justify-center text-text-muted hover:text-accent-primary transition-colors">
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
            <p className="font-bold">No submissions found</p>
            <p className="text-xs text-text-faint mt-0.5">You haven&apos;t composed any blog posts yet. Click &quot;Write Blog Post&quot; to begin.</p>
          </div>
        )}
      </div>

      {/* Slide Drawer Component */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-bg-surface border-l border-border-default overflow-y-auto custom-scrollbar p-6">
          <SheetHeader className="border-b border-border-default/60 pb-4 mb-6">
            <SheetTitle className="text-xl font-bold font-heading text-text-primary">
              {editingPost ? "Edit Blog Post" : "Compose Blog Post"}
            </SheetTitle>
          </SheetHeader>

          {sheetOpen && (
            <BlogForm
              initialPost={editingPost}
              onSubmit={handleBlogSubmit}
              submitStatusType="pending"
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
