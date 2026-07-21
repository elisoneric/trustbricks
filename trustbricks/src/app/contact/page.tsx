import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import ContactPageClient from "@/components/ContactPageClient";
import { getBranches, getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Contact Us | Trust Bricks Properties Ltd",
  description: "Get in touch with a Trust Bricks Properties advisor at any of our 14 branches across Nigeria for PenCom RSA mortgage support.",
};

export default async function ContactPage() {
  const { branches } = await getBranches();
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <ContactPageClient branches={branches || []} />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
