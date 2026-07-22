import { Metadata } from "next";
import GlobalNavbar from "@/components/GlobalNavbar";
import EligibilityFunnelPage from "@/components/EligibilityFunnelPage";
import Footer from "@/components/Footer";
import { getAdminConfig, getBranches } from "@/app/actions/adminActions";

export const metadata: Metadata = {
  title: "Check RSA Mortgage Eligibility | Trust Bricks Properties",
  description: "Verify your RSA equity contribution eligibility under PenCom guidelines. Access up to 25% of your pension balance for residential home equity.",
};

export default async function ApplyPage() {
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};
  const { branches } = await getBranches();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] font-sans antialiased selection:bg-[var(--color-clay-500)] selection:text-white flex flex-col justify-between">
      <GlobalNavbar />
      <main id="main-content" className="flex-grow">
        <EligibilityFunnelPage branches={branches || []} />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
