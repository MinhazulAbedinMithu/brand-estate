"use client";

import * as React from "react";
import type { BlogPost } from "@/lib/types";
import { mockBlogPosts } from "@/src/mocks/blogPostsMock";

const BLOGS_DB_KEY = "brand-estate-blogs-db";

const DEFAULT_REACTIONS = {
  "🔥": 0,
  "❤️": 0,
  "👏": 0,
  "💡": 0,
  "😮": 0,
  "🚀": 0,
};

// Seed posts with active reactions and published status
const getSeededPosts = (): BlogPost[] => {
  return mockBlogPosts.map((post, index) => {
    // Generate some starter reactions based on index to look realistic
    const reactions = {
      "🔥": (index + 2) * 5 + 3,
      "❤️": (index + 1) * 8 + 4,
      "👏": (index + 3) * 6 + 2,
      "💡": (index + 1) * 4 + 1,
      "😮": index * 2,
      "🚀": (index + 1) * 3,
    };
    return {
      ...post,
      status: post.status || "published",
      authorRole: post.authorRole || "admin",
      authorId: post.authorId || `usr-admin-${index}`,
      reactions: post.reactions || reactions,
    };
  });
};

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
}

const BlogContext = React.createContext<BlogContextValue | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize store on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(BLOGS_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => {
          setPosts(parsed);
        });
      } else {
        const seeded = getSeededPosts();
        localStorage.setItem(BLOGS_DB_KEY, JSON.stringify(seeded));
        Promise.resolve().then(() => {
          setPosts(seeded);
        });
      }
    } catch (e) {
      console.error("Failed to load blogs database from localStorage:", e);
    } finally {
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    try {
      localStorage.setItem(BLOGS_DB_KEY, JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (e) {
      console.error("Failed to save blogs database to localStorage:", e);
    }
  };

  const createPost = React.useCallback(
    async (
      postData: Omit<BlogPost, "id" | "publishedAt" | "reactions"> & {
        status: "draft" | "pending" | "published";
      }
    ): Promise<BlogPost> => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 600));

      const newPost: BlogPost = {
        ...postData,
        id: `post-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        reactions: { ...DEFAULT_REACTIONS },
      };

      savePosts([newPost, ...posts]);
      return newPost;
    },
    [posts]
  );

  const updatePost = React.useCallback(
    async (updatedPost: BlogPost): Promise<void> => {
      await new Promise((r) => setTimeout(r, 400));
      const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
      savePosts(updated);
    },
    [posts]
  );

  const deletePost = React.useCallback(
    async (id: string): Promise<void> => {
      await new Promise((r) => setTimeout(r, 300));
      const filtered = posts.filter((p) => p.id !== id);
      savePosts(filtered);
    },
    [posts]
  );

  const reactToPost = React.useCallback(
    async (id: string, emoji: string): Promise<void> => {
      // Optimistic update
      const updated = posts.map((post) => {
        if (post.id === id) {
          const currentReactions = post.reactions || { ...DEFAULT_REACTIONS };
          return {
            ...post,
            reactions: {
              ...currentReactions,
              [emoji]: (currentReactions[emoji] || 0) + 1,
            },
          };
        }
        return post;
      });
      savePosts(updated);
    },
    [posts]
  );

  const reviewPost = React.useCallback(
    async (id: string, status: "published" | "rejected", reason?: string): Promise<void> => {
      await new Promise((r) => setTimeout(r, 500));
      const updated = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            status,
            rejectionReason: status === "rejected" ? reason : undefined,
          };
        }
        return post;
      });
      savePosts(updated);
    },
    [posts]
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
    }),
    [posts, isLoading, createPost, updatePost, deletePost, reactToPost, reviewPost]
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
