export type ReleaseCard = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  version: string;
  fileSize: string | null;
  thumbnailUrl: string | null;
  featured: boolean;
  downloads: number;
  likes: number;
  rating: number | null;
  ratingCount: number;
  createdAt: string;
};

export type CommentItem = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
};

export type ReleaseDetail = ReleaseCard & {
  description: string;
  fileName: string | null;
  downloadUrl: string;
  videoUrl: string | null;
  tags: string[];
  changelog: string[];
  comments: CommentItem[];
};

export type ReleaseInput = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  version: string;
  fileSize?: string;
  fileName?: string;
  downloadUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  changelog: string[];
  featured: boolean;
};


export type PostKind = "journal" | "community" | "announcement";

export type PostCard = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  kind: PostKind;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  externalUrl: string | null;
  featured: boolean;
  published: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PostDetail = PostCard & {
  content: string;
  comments: CommentItem[];
};
