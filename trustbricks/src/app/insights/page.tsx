import { createClient } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlobalNavbar from "@/components/GlobalNavbar";

export const metadata = {
  title: "Insights & News | Trust Bricks Properties Ltd",
  description: "Stay updated with the latest in Nigerian real estate, PenCom RSA mortgages, and homeownership tips.",
};

// Scaffolded Sanity Client (User must configure env variables later)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // For dynamic ISR
});

export default async function InsightsPage() {
  // Fetch posts from Sanity
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "authorName": author->name,
    "authorImage": author->image.asset->url,
    "mainImage": mainImage.asset->url,
    publishedAt
  }`;

  // If no projectId is configured, it will fail, so we wrap in try/catch and provide fallbacks.
  let posts: any[] = [];
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "demo") {
      posts = await client.fetch(query);
    } else {
      // Mock Data so the UI still looks incredible during development before Sanity is fully linked
      posts = [
        {
          _id: "1",
          title: "How to Access 25% of Your RSA for a Mortgage",
          slug: "access-25-rsa-mortgage",
          authorName: "Amina Yusuf",
          mainImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          publishedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Top 5 Up-and-Coming Neighborhoods in Abuja",
          slug: "abuja-top-neighborhoods",
          authorName: "Chinedu Okonkwo",
          mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: "3",
          title: "Understanding the New PenCom Guidelines for 2024",
          slug: "pencom-guidelines-2024",
          authorName: "Sarah Adebayo",
          mainImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ];
    }
  } catch (err) {
    console.error("Sanity Fetch Error:", err);
  }

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      {/* Header Section */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8 bg-[var(--color-ink-700)] text-white">
        {/* Brick coursing texture, quiet */}
        <div
          className="absolute inset-0 pattern-brick opacity-[0.05]"
          style={{ ["--brick-line" as any]: "white", ["--brick-bg" as any]: "transparent" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Market Insights & <span className="text-[var(--color-clay-200)]">News</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Stay ahead of the curve. Read the latest updates on the Nigerian real estate market and expert guides on maximizing your RSA mortgage.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/insights/${post.slug}`} className="group block h-full">
              <article className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-ink-700)]/5">
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-[var(--color-mortar-50)]">
                  {post.mainImage ? (
                    <Image
                      src={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-clay-500)] mb-3 uppercase tracking-wider">
                    <span className="font-tabular">{new Date(post.publishedAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--color-text-heading)] mb-4 line-clamp-2 group-hover:text-[var(--color-clay-500)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {post.title}
                  </h2>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-ink-700)] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {post.authorName ? post.authorName.charAt(0) : 'T'}
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-body)]">
                        {post.authorName || 'Trust Bricks Team'}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--color-clay-500)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
