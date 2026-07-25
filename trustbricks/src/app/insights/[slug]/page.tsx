import { notFound } from "next/navigation";
import Link from "next/link";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { getBlogPostBySlug } from "@/app/actions/blogActions";
import { getAdminConfig } from "@/app/actions/adminActions";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getBlogPostBySlug(slug);
  if (!post || !post.published) {
    return {
      title: "Article Not Found | Trust Bricks Properties Ltd",
    };
  }

  const pageTitle = `${post.title} | Trust Bricks Insights`;
  const description = post.excerpt || post.body.slice(0, 160);
  const canonicalUrl = `https://trustbrickspropertieslimited.com.ng/insights/${post.slug}`;
  const images = post.coverImage ? [post.coverImage] : ["https://trustbrickspropertieslimited.com.ng/og-image.jpg"];

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: canonicalUrl,
      siteName: "Trust Bricks Properties",
      locale: "en_NG",
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      authors: [post.authorName || "Trust Bricks Team"],
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: description,
      images: images,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post } = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const config = await getAdminConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.body.slice(0, 160),
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : (post.publishedAt || post.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Trust Bricks Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Trust Bricks Properties Ltd",
      logo: {
        "@type": "ImageObject",
        url: "https://trustbrickspropertieslimited.com.ng/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://trustbrickspropertieslimited.com.ng/insights/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      {/* Google Rich Snippets / JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-clay-500)] transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Insights
          </Link>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full h-72 object-cover rounded-3xl mb-8" />
          )}

          <div className="flex items-center gap-3 mb-4 text-xs text-[var(--color-text-muted)]">
            <div className="w-7 h-7 rounded-full bg-[var(--color-ink-700)] flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {post.authorName?.charAt(0) || "T"}
            </div>
            <span className="font-medium text-[var(--color-text-body)]">{post.authorName}</span>
            <span>·</span>
            <span className="font-tabular">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h1>

          <div className="text-sm text-[var(--color-text-body)] leading-relaxed whitespace-pre-line">
            {post.body}
          </div>
        </article>
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
