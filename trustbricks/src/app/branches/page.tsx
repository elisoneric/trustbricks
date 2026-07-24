import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import BranchMapClient from "@/components/BranchMapClient";
import { getBranches } from "@/app/actions/adminActions";
import { getAdminConfig } from "@/app/actions/adminActions";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Our Branches | Trust Bricks Properties Ltd",
  description: "Find a Trust Bricks Properties branch near you — 14 locations across Nigeria on an interactive map.",
};

export default async function BranchesPage() {
  const { branches } = await getBranches();
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
              {branches?.length || 0} Branches Nationwide
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Find a Branch <br />
              <span className="text-[var(--color-clay-500)]">Near You.</span>
            </h1>
            <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
              Click a state to zoom in, or click a marker for full contact details — a licensed advisor is ready in every region we serve.
            </p>
          </div>

          <BranchMapClient branches={branches || []} />
        </section>
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
