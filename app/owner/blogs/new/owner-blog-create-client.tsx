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

export function OwnerBlogCreateClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createPost } = useBlogs();

  const handleBlogSubmit = async (
    formPayload: Omit<BlogPost, "id" | "publishedAt" | "reactions" | "author" | "authorId" | "authorRole">,
    submitStatus: "draft" | "pending" | "published"
  ) => {
    const author = {
      name: currentUser?.name || "Anonymous Agent",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      role: "Luxury Property Advisor",
      bio: currentUser?.legalDocs?.agencyName
        ? `Licensed agent at ${currentUser.legalDocs.agencyName}. Advising buyers and sellers worldwide.`
        : "Real Estate Agent with expert insights on competitive residential housing markets."
    };

    const finalPayload = {
      ...formPayload,
      author,
      authorId: currentUser?.id,
      authorRole: currentUser?.role,
      status: submitStatus,
    };

    try {
      await createPost(finalPayload);
      toast.success("Blog post submitted", {
        description: submitStatus === "pending" ? "It is now pending admin review before publishing." : "Saved as draft.",
      });
      router.push("/owner/blogs");
    } catch {
      toast.error("Failed to submit blog post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center gap-3 border-b border-border-default/60 pb-5">
        <Button
          onClick={() => router.push("/owner/blogs")}
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border-default cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
            Create Blog Post
          </h1>
          <p className="text-xs text-text-muted font-medium font-body">Compose a new article for public insights</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border-default bg-bg-surface shadow-sm">
        <BlogForm
          onSubmit={handleBlogSubmit}
          submitStatusType="pending"
        />
      </div>
    </div>
  );
}
