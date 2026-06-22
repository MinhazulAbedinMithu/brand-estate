"use client";

import * as React from "react";
import Link from "next/link";
import { 
  FileText, CheckCircle2, XCircle, Eye, Trash2, Plus, 
  FileEdit, HelpCircle, Search 
} from "lucide-react";
import { useBlogs } from "@/lib/blog-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BlogForm } from "@/components/blog/blog-form";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types";

export function AdminBlogsClient() {
  const { currentUser } = useAuth();
  const { posts, createPost, updatePost, deletePost, reviewPost } = useBlogs();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<"queue" | "catalog">("queue");

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");

  // Rejection Dialog State
  const [rejectionPostId, setRejectionPostId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  // Inspector Drawer State
  const [inspectPost, setInspectPost] = React.useState<BlogPost | null>(null);
  const [inspectOpen, setInspectOpen] = React.useState(false);

  // Compose/Edit Form Drawer State
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);

  // Pending Posts Filter
  const pendingPosts = React.useMemo(() => {
    return posts.filter((p) => p.status === "pending");
  }, [posts]);

  // Catalog filtering
  const filteredCatalogPosts = React.useMemo(() => {
    let result = posts;

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((p) => p.authorRole === roleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        p.title.toLowerCase().includes(q) || 
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, searchQuery, statusFilter, roleFilter]);

  // Review actions
  const handleApprove = async (postId: string) => {
    try {
      await reviewPost(postId, "published");
      toast.success("Blog post approved!", { description: "It is now visible on the public insights page." });
      if (inspectPost?.id === postId) {
        setInspectOpen(false);
      }
    } catch {
      toast.error("Failed to approve blog post.");
    }
  };

  const handleOpenReject = (postId: string) => {
    setRejectionPostId(postId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.warning("Reason required", { description: "Please state the reason for rejecting this article." });
      return;
    }
    if (!rejectionPostId) return;

    try {
      await reviewPost(rejectionPostId, "rejected", rejectionReason.trim());
      toast.success("Blog post rejected", { description: "The author will see your feedback in their workspace dashboard." });
      setRejectDialogOpen(false);
      if (inspectPost?.id === rejectionPostId) {
        setInspectOpen(false);
      }
    } catch {
      toast.error("Failed to reject post.");
    }
  };

  const handleInspect = (post: BlogPost) => {
    setInspectPost(post);
    setInspectOpen(true);
  };

  // Compose forms actions
  const handleOpenCompose = () => {
    setEditingPost(null);
    setComposeOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setComposeOpen(true);
  };

  // Form Submit handler bridging BlogForm payload
  const handleBlogSubmit = async (
    formPayload: Omit<BlogPost, "id" | "publishedAt" | "reactions" | "author" | "authorId" | "authorRole">,
    submitStatus: "draft" | "pending" | "published"
  ) => {
    const author = {
      name: currentUser?.name || "Moderator Admin",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      role: "Platform Editor",
      bio: "Platform Administrator. Fact-checking real estate trends and market policies."
    };

    const postPayload = {
      ...formPayload,
      author,
      authorId: currentUser?.id,
      authorRole: currentUser?.role,
      isFeatured: editingPost ? editingPost.isFeatured : false,
      status: submitStatus,
    };

    try {
      if (editingPost) {
        await updatePost({
          ...editingPost,
          ...postPayload,
        });
        toast.success("Article updated", {
          description: submitStatus === "published" ? "Changes have been published instantly." : "Saved as draft.",
        });
      } else {
        await createPost(postPayload);
        toast.success("New article published", {
          description: submitStatus === "published" ? "It is now visible on the public insights catalog." : "Saved as draft.",
        });
      }
      setComposeOpen(false);
    } catch {
      toast.error("An error occurred during submission.");
    }
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Delete this blog post? It will be permanently removed from all archives.")) {
      try {
        await deletePost(postId);
        toast.success("Post removed successfully");
      } catch {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Creation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
            Insights Moderation Console
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Review user & agent draft submittals, control the public insights catalog, and write administrative guides.
          </p>
        </div>

        <Button onClick={handleOpenCompose} className="h-10 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white font-bold gap-1.5 self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Write Admin Post</span>
        </Button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border-default/40">
        <button
          onClick={() => setActiveTab("queue")}
          className={cn(
            "px-6 py-3 text-sm font-bold font-body transition-colors relative cursor-pointer",
            activeTab === "queue"
              ? "text-accent-primary border-b-2 border-accent-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Review Queue
          {pendingPosts.length > 0 && (
            <span className="ml-2 bg-rose-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full select-none">
              {pendingPosts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={cn(
            "px-6 py-3 text-sm font-bold font-body transition-colors relative cursor-pointer",
            activeTab === "catalog"
              ? "text-accent-primary border-b-2 border-accent-primary"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Catalog Database & Analytics
        </button>
      </div>

      {/* WORKFLOW A: Review Queue */}
      {activeTab === "queue" && (
        <div className="space-y-6">
          {pendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingPosts.map((post) => (
                <div 
                  key={post.id}
                  className="rounded-2xl border border-border-default bg-bg-surface overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="relative aspect-video w-full overflow-hidden bg-bg-elevated border-b border-border-default/60">
                      <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                      <span className="absolute top-4 left-4 bg-accent-primary/20 text-accent-primary border border-accent-primary/30 backdrop-blur-md text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {post.category.replace("-", " ")}
                      </span>
                    </div>

                    {/* Metadata body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full border border-border-default object-cover" />
                        <span className="text-xs font-bold text-text-primary">{post.author.name}</span>
                        <span className="text-[9px] font-extrabold text-accent-primary uppercase px-2 py-0.5 rounded-md border border-accent-primary/20 bg-accent-primary/10">
                          {post.authorRole === "agent" ? "Agent" : "User"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold font-body text-text-primary leading-snug line-clamp-1">{post.title}</h3>
                      <p className="text-xs text-text-secondary font-body line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-bg-alt/30 border-t border-border-default/60 flex items-center justify-between gap-3">
                    <Button
                      onClick={() => handleInspect(post)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold gap-1 rounded-full hover:bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect Post</span>
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenReject(post.id)}
                        size="sm"
                        className="text-xs font-bold gap-1 rounded-full bg-state-error/10 hover:bg-state-error/15 border border-state-error/25 text-state-error hover:text-rose-400 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        onClick={() => handleApprove(post.id)}
                        size="sm"
                        className="text-xs font-bold gap-1 rounded-full bg-state-success/10 hover:bg-state-success/15 border border-state-success/25 text-state-success hover:text-emerald-400 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface/50 p-12 text-center py-16 max-w-xl mx-auto">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Queue is clear!</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                There are currently no user or agent blog submittals pending verification. You will be notified in your sidebar when new draft files arrive.
              </p>
            </div>
          )}
        </div>
      )}

      {/* WORKFLOW B: Catalog Database & Analytics */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs shrink-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-faint" />
              <input
                type="text"
                placeholder="Search catalog by title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 text-xs rounded-full border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:justify-end text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-muted">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none"
                >
                  <option value="all" className="bg-bg-surface">All</option>
                  <option value="published" className="bg-bg-surface">Published</option>
                  <option value="pending" className="bg-bg-surface">Pending Review</option>
                  <option value="rejected" className="bg-bg-surface">Rejected</option>
                  <option value="draft" className="bg-bg-surface">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-text-muted">Author Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none"
                >
                  <option value="all" className="bg-bg-surface">All Roles</option>
                  <option value="admin" className="bg-bg-surface">Admin</option>
                  <option value="agent" className="bg-bg-surface">Agent</option>
                  <option value="auth_user" className="bg-bg-surface">User / Member</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Listings */}
          <div className="rounded-2xl border border-border-default/60 bg-bg-surface overflow-hidden shadow-sm">
            {filteredCatalogPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-bg-alt/40 border-b border-border-default text-text-muted font-bold font-body">
                      <th className="p-4">Article Title</th>
                      <th className="p-4">Author Profile</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Views</th>
                      <th className="p-4 text-center">Engagement</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatalogPosts.map((post) => {
                      const reactionsCount = post.reactions ? Object.values(post.reactions).reduce((a, b) => a + b, 0) : 0;
                      return (
                        <tr key={post.id} className="border-b border-border-default/50 hover:bg-bg-alt/30 transition-colors font-body text-text-secondary">
                          <td className="p-4 flex items-center gap-3 min-w-[280px]">
                            <img src={post.coverImage} alt={post.title} className="h-12 w-16 object-cover rounded-lg border border-border-default bg-bg-elevated" />
                            <div className="min-w-0">
                              <h4 className="font-bold text-text-primary truncate max-w-xs">{post.title}</h4>
                              <span className="text-[10px] text-text-faint truncate block mt-0.5">Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full border border-border-default object-cover" />
                              <div>
                                <span className="font-bold text-text-primary block leading-tight">{post.author.name}</span>
                                <span className="text-[9px] text-text-muted capitalize block">{post.authorRole?.replace("_", " ") || "admin"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize">{post.category.replace("-", " ")}</td>
                          <td className="p-4">
                            <span className={cn(
                              "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                              post.status === "published" && "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                              post.status === "pending" && "text-amber-400 bg-amber-500/10 border-amber-500/20",
                              post.status === "draft" && "text-slate-400 bg-slate-500/10 border-slate-500/20",
                              post.status === "rejected" && "text-rose-400 bg-rose-500/10 border-rose-500/20"
                            )}>
                              {post.status || "published"}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-text-primary">{post.views || 0}</td>
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
                <p className="font-bold">No posts cataloged matching search criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECTOR DRAWER (Pending Posts Details Review) */}
      <Sheet open={inspectOpen} onOpenChange={setInspectOpen}>
        {inspectPost && (
          <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-bg-surface border-l border-border-default overflow-y-auto custom-scrollbar p-6 space-y-6">
            <SheetHeader className="border-b border-border-default/60 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="bg-accent-primary/20 text-accent-primary border border-accent-primary/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {inspectPost.category.replace("-", " ")}
                </span>
                <span className="text-[10px] text-text-faint font-semibold">Submitted: {new Date(inspectPost.publishedAt).toLocaleDateString()}</span>
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-text-primary text-left mt-2">
                {inspectPost.title}
              </SheetTitle>
              <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-text-secondary border-t border-border-default/45 mt-3">
                <img src={inspectPost.author.avatar} alt={inspectPost.author.name} className="h-6 w-6 rounded-full border border-border-default object-cover" />
                <span>By {inspectPost.author.name}</span>
                <span>•</span>
                <span className="capitalize">{inspectPost.authorRole?.replace("_", " ")}</span>
                <span>•</span>
                <span>{inspectPost.readTimeMinutes} min read</span>
              </div>
            </SheetHeader>

            {/* Content Display */}
            <div className="space-y-6 text-sm font-body">
              {/* Cover */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border-default/60 bg-bg-elevated shadow-sm">
                <img src={inspectPost.coverImage} alt={inspectPost.title} className="h-full w-full object-cover" />
              </div>

              {/* Excerpt */}
              <div className="p-4 rounded-2xl border border-border-default/80 bg-bg-elevated/40">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest block mb-1">Excerpt Preview</span>
                <p className="text-text-secondary leading-relaxed font-medium">{inspectPost.excerpt}</p>
              </div>

              {/* Body Content */}
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest block border-b border-border-default pb-1">Full Content Body</span>
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed bg-bg-elevated/25 p-4 rounded-2xl border border-border-default/50 max-h-96 overflow-y-auto">
                  {inspectPost.content.split("\n").map((line, idx) => (
                    <p key={idx} className="mb-3">{line}</p>
                  ))}
                </div>
              </div>

              {/* SEO details */}
              <div className="rounded-2xl border border-border-default bg-bg-surface p-4 space-y-3.5">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest block border-b border-border-default pb-1">SEO settings metadata</span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-muted font-bold block">Meta Title:</span>
                    <span className="text-text-primary font-medium">{inspectPost.seo.title}</span>
                  </div>
                  <div>
                    <span className="text-text-muted font-bold block">Keywords:</span>
                    <span className="text-text-primary font-medium">{inspectPost.seo.keywords.join(", ") || "None"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted font-bold block">Canonical Link:</span>
                    <span className="text-text-primary font-medium truncate block">{inspectPost.seo.canonicalUrl || "Default (Direct)"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted font-bold block">OpenGraph Title:</span>
                    <span className="text-text-primary font-medium block">{inspectPost.seo.ogTitle || "Default"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted font-bold block">Search Engine Visibility:</span>
                    <span className={cn("font-bold", inspectPost.seo.noIndex ? "text-rose-400" : "text-emerald-400")}>
                      {inspectPost.seo.noIndex ? "No Index, No Follow (Blocked)" : "Index, Follow (Visible)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action queue controls */}
              <div className="flex gap-4 pt-4 border-t border-border-default/60">
                <Button
                  onClick={() => handleOpenReject(inspectPost.id)}
                  className="flex-1 h-11 bg-state-error/10 hover:bg-state-error/15 border border-state-error/20 text-state-error rounded-full font-bold shadow-sm cursor-pointer"
                >
                  Reject & Provide Feedback
                </Button>
                <Button
                  onClick={() => handleApprove(inspectPost.id)}
                  className="flex-1 h-11 bg-accent-primary hover:bg-accent-primary-hov text-white rounded-full font-bold shadow-md cursor-pointer"
                >
                  Approve & Publish Immediately
                </Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* REJECTION REASON DIALOG */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">Rejection Reason</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-2 text-sm font-body">
            <p className="text-xs text-text-secondary">Please provide structured review feedback. The author will see this in their workspace dashboard and can revise the article for resubmission.</p>
            <textarea
              required
              rows={4}
              placeholder="e.g. Please clarify paragraph 3 regarding luxury property yields, or verify the calculations in your formulas before resubmitting."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-default bg-bg-base text-text-primary focus:border-accent-primary outline-none transition-colors"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="h-10 border-border-default rounded-full text-xs font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              className="h-10 bg-state-error hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-md cursor-pointer"
            >
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* COMPOSE/EDIT SHEET FOR ADMIN AUTO-PUBLISHED ARTICLES */}
      <Sheet open={composeOpen} onOpenChange={setComposeOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-bg-surface border-l border-border-default overflow-y-auto custom-scrollbar p-6">
          <SheetHeader className="border-b border-border-default/60 pb-4 mb-6">
            <SheetTitle className="text-xl font-bold font-heading text-text-primary">
              {editingPost ? "Edit Article" : "Compose Editor Article"}
            </SheetTitle>
          </SheetHeader>

          {composeOpen && (
            <BlogForm
              initialPost={editingPost}
              onSubmit={handleBlogSubmit}
              submitStatusType="published"
              defaultCoverImage="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
