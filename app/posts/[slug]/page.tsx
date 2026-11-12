import type { Metadata } from "next";
import { PostDetailView } from "@/components/post-detail";

type Context = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Context): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return { title: `${title} — Rekam Kerja`, description: `Catatan kerja, pembelajaran, dan diskusi publik: ${title}.` };
}

export default async function PostPage({ params }: Context) {
  const { slug } = await params;
  return <PostDetailView slug={slug} />;
}
