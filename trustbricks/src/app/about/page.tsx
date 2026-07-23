import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import CoreValuesSection from "@/components/CoreValuesSection";
import { getAdminConfig } from "@/app/actions/adminActions";
import type { CoreValue, LeadershipMember } from "@/lib/types";

export const metadata = {
  title: "About Us | Trust Bricks Properties Ltd",
  description: "Learn about Trust Bricks Properties Ltd — our vision, mission, and the team behind Nigeria's PenCom RSA mortgage specialists.",
};

export default async function AboutPage() {
  const config = await getAdminConfig();
  const site = config?.site || {};

  let coreValues: CoreValue[] = [];
  try { coreValues = JSON.parse(site.coreValues || "[]"); } catch { coreValues = []; }

  let leadershipTeam: LeadershipMember[] = [];
  try { leadershipTeam = JSON.parse(site.leadershipTeam || "[]"); } catch { leadershipTeam = []; }

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
            About Trust Bricks
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Teamwork Makes The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-clay-500)] to-[var(--color-clay-600)]">Dream Work.</span>
          </h1>
          {site.aboutHeroImage && (
            <img src={site.aboutHeroImage} alt="" className="w-full max-w-3xl mx-auto rounded-3xl mb-8 aspect-video object-cover" />
          )}
          <p className="text-lg text-[var(--color-text-body)] leading-relaxed">
            {site.aboutBody || "Trust Bricks Properties Ltd is a mortgage facilitation and real estate advisory firm in Nigeria."}
          </p>
        </section>

        <CoreValuesSection vision={site.vision} mission={site.mission} coreValues={coreValues} compact />

        {leadershipTeam.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 lg:px-8 mt-20">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-heading)] text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
              Meet The Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadershipTeam.map((member, i) => (
                <div key={i} className="bg-[var(--color-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-card text-center">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>{member.name}</h3>
                  <p className="text-xs text-[var(--color-clay-500)] font-bold uppercase tracking-wide mb-2">{member.title}</p>
                  {member.bio && <p className="text-xs text-[var(--color-text-body)] leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer siteSettings={site} />
    </div>
  );
}
