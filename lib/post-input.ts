import { validHttpUrl } from "@/lib/http";
import type { PostKind } from "@/lib/types";

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  kind: PostKind;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  externalUrl: string | null;
  featured: boolean;
  published: boolean;
};

export function parsePostInput(raw: unknown): { data?: PostInput; error?: string } {
  const input = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const title = typeof input.title === "string" ? input.title.trim().slice(0, 180) : "";
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase().slice(0, 190) : "";
  const excerpt = typeof input.excerpt === "string" ? input.excerpt.trim().slice(0, 360) : "";
  const content = typeof input.content === "string" ? input.content.trim().slice(0, 50000) : "";
  const kind = input.kind === "community" || input.kind === "announcement" ? input.kind : "journal";
  const category = typeof input.category === "string" ? input.category.trim().slice(0, 80) : "";
  const coverImageUrl = typeof input.coverImageUrl === "string" && input.coverImageUrl.trim() ? input.coverImageUrl.trim() : null;
  const externalUrl = typeof input.externalUrl === "string" && input.externalUrl.trim() ? input.externalUrl.trim() : null;

  if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !excerpt || !content || !category) {
    return { error: "Judul, slug, ringkasan, isi post, dan kategori wajib diisi dengan benar." };
  }
  if (coverImageUrl && !validHttpUrl(coverImageUrl)) return { error: "URL cover harus berupa http atau https." };
  if (externalUrl && !validHttpUrl(externalUrl)) return { error: "URL referensi harus berupa http atau https." };

  const tags = Array.isArray(input.tags)
    ? input.tags.filter((value): value is string => typeof value === "string").map((value) => value.trim().slice(0, 32)).filter(Boolean).slice(0, 16)
    : [];

  return {
    data: {
      title, slug, excerpt, content, kind, category, tags, coverImageUrl, externalUrl,
      featured: Boolean(input.featured),
      published: input.published !== false,
    },
  };
}
