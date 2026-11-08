import type { Metadata } from "next";
import { ReleaseDetail } from "@/components/release-detail";

type Context = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Context): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} — Release details`, description: `Detail release, informasi versi, changelog, komentar, dan download untuk ${slug.replace(/-/g, " ")}.` };
}

export default async function LibraryItemPage({ params }: Context) {
  const { slug } = await params;
  return <ReleaseDetail slug={slug} />;
}
