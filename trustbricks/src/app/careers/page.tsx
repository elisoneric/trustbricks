import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import CareersPageClient from "@/components/CareersPageClient";
import { getJobs } from "@/app/actions/jobActions";
import { getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Careers | Trust Bricks Properties Ltd",
  description: "Join the Trust Bricks Properties Ltd team — open roles across Nigeria.",
};

export default async function CareersPage() {
  const { jobs } = await getJobs(true);
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <CareersPageClient jobs={jobs || []} />
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
