"use client";

import * as React from "react";
import type { BlogPost } from "@/lib/types";

interface BlogContextValue {
  posts: BlogPost[];
  isLoading: boolean;
  createPost: (
    postData: Omit<BlogPost, "id" | "publishedAt" | "reactions"> & {
      status: "draft" | "pending" | "published";
    }
  ) => Promise<BlogPost>;
  updatePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  reactToPost: (id: string, emoji: string) => Promise<void>;
  reviewPost: (id: string, status: "published" | "rejected", reason?: string) => Promise<void>;
  trackBlogView: (id: string) => Promise<void>;
}

const BlogContext = React.createContext<BlogContextValue | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch blogs list from backend API
  const fetchBlogs = React.useCallback(async () => {
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        setPosts(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch blogs from API:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize store on mount
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, [fetchBlogs]);

  const createPost = React.useCallback(
    async (
      postData: Omit<BlogPost, "id" | "publishedAt" | "reactions"> & {
        status: "draft" | "pending" | "published";
      }
    ): Promise<BlogPost> => {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const json = await res.json();
      if (json.status !== "success") {
        throw new Error(json.message || "Failed to create blog post");
      }

      const createdData = json.data;
      const newPost: BlogPost = {
        ...postData,
        id: createdData.id,
        slug: createdData.slug,
        status: createdData.status,
        publishedAt: new Date().toISOString(),
        reactions: {
          "🔥": 0, "❤️": 0, "👏": 0, "💡": 0, "😮": 0, "🚀": 0
        },
      };

      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    []
  );

  const updatePost = React.useCallback(
    async (updatedPost: BlogPost): Promise<void> => {
      const res = await fetch(`/api/blogs/${updatedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      const json = await res.json();
      if (json.status !== "success") {
        throw new Error(json.message || "Failed to update blog post");
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === updatedPost.id 
            ? { ...p, ...updatedPost, slug: json.data.slug, status: json.data.status } 
            : p
        )
      );
    },
    []
  );

  const deletePost = React.useCallback(
    async (id: string): Promise<void> => {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.status !== "success") {
        throw new Error(json.message || "Failed to delete blog post");
      }

      setPosts((prev) => prev.filter((p) => p.id !== id));
    },
    []
  );

  const reactToPost = React.useCallback(
    async (id: string, emoji: string): Promise<void> => {
      // Optimistic update locally
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === id) {
            const current = post.reactions || {};
            return {
              ...post,
              reactions: {
                ...current,
                [emoji]: (current[emoji] || 0) + 1,
              },
            };
          }
          return post;
        })
      );

      // Async backend update
      try {
        const res = await fetch(`/api/blogs/${id}/react`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reactionType: emoji }),
        });
        const json = await res.json();
        if (json.status === "success" && json.data?.reactions) {
          // Re-sync with actual database state in case other reactions happened
          setPosts((prev) =>
            prev.map((post) =>
              post.id === id ? { ...post, reactions: json.data.reactions } : post
            )
          );
        }
      } catch (e) {
        console.error("Failed to submit reaction to API:", e);
      }
    },
    []
  );

  const reviewPost = React.useCallback(
    async (id: string, status: "published" | "rejected", reason?: string): Promise<void> => {
      const res = await fetch(`/api/blogs/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });

      const json = await res.json();
      if (json.status !== "success") {
        throw new Error(json.message || "Failed to complete review");
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id 
            ? { ...post, status, rejectionReason: status === "rejected" ? reason : undefined } 
            : post
        )
      );
    },
    []
  );

  const trackBlogView = React.useCallback(
    async (id: string): Promise<void> => {
      // Optimistic update locally
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );

      try {
        const res = await fetch(`/api/blogs/${id}/view`, {
          method: "POST",
        });
        const json = await res.json();
        if (json.status === "success" && json.data && typeof json.data.views === "number") {
          // Re-sync with actual database state
          setPosts((prev) =>
            prev.map((post) =>
              post.id === id ? { ...post, views: json.data.views } : post
            )
          );
        }
      } catch (e) {
        console.error("Failed to track blog view:", e);
      }
    },
    []
  );

  const value = React.useMemo(
    () => ({
      posts,
      isLoading,
      createPost,
      updatePost,
      deletePost,
      reactToPost,
      reviewPost,
      trackBlogView,
    }),
    [posts, isLoading, createPost, updatePost, deletePost, reactToPost, reviewPost, trackBlogView]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlogs() {
  const context = React.useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
}

