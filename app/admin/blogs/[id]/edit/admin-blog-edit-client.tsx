"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBlogs } from "@/lib/blog-context";
import { useAuth } from "@/lib/auth-context";
import { BlogForm } from "@/components/blog/blog-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types";

export function AdminBlogEditClient({ id }: { id: string }) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { posts, updatePost, isLoading } = useBlogs();

  const blogPost = React.useMemo(() => {
    return posts.find((p) => p.id === id);
  }, [posts, id]);

  const handleBlogSubmit = async (
    formPayload: Omit<BlogPost, "id" | "publishedAt" | "reactions" | "author" | "authorId" | "authorRole">,
    submitStatus: "draft" | "pending" | "published"
  ) => {
    if (!blogPost) return;

    const author = {
      name: currentUser?.name || "Administrator",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      role: "Platform Administrator",
      bio: "Editorial manager and platform quality inspector.",
    };

    const finalPayload = {
      ...formPayload,
      author,
      authorId: currentUser?.id,
      authorRole: currentUser?.role,
      status: submitStatus,
    };

    try {
      await updatePost({
        ...blogPost,
        ...finalPayload,
      });
      toast.success("Blog post updated", {
        description: submitStatus === "published" ? "Saved and updated live." : "Saved as draft.",
      });
      router.push("/admin/blogs");
    } catch {
      toast.error("Failed to update blog post");
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-medium text-text-muted">Loading article details...</div>;
  }

  if (!blogPost) {
    return <div className="py-20 text-center font-medium text-state-error">Article not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-3 border-b border-border-default/60 pb-5">
        <Button
          onClick={() => router.push("/admin/blogs")}
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border-default cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
            Edit Blog Post
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Modify article content and metadata settings</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border-default bg-bg-surface shadow-sm">
        <BlogForm
          initialPost={blogPost}
          onSubmit={handleBlogSubmit}
          submitStatusType="published"
        />
      </div>
    </div>
  );
}
