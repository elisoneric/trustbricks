import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { getBlogPosts } from "@/app/actions/blogActions";
import { getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Insights & News | Trust Bricks Properties Ltd",
  description: "Stay updated with the latest in Nigerian real estate, PenCom RSA mortgages, and homeownership tips.",
};

export default async function InsightsPage() {
  const { posts } = await getBlogPosts(true);
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8 bg-[var(--color-ink-700)] text-white">
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

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No posts published yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/insights/${post.slug}`} className="group block h-full">
                <article className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-ink-700)]/5">
                  <div className="relative h-56 w-full overflow-hidden bg-[var(--color-mortar-50)]">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-clay-500)] mb-3 uppercase tracking-wider">
                      <span className="font-tabular">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
        )}
      </main>

      <Footer siteSettings={config?.site} />
    </div>
  );
}
