import GlobalNavbar from "@/components/GlobalNavbar";
import HomeClient   from "@/components/HomeClient";
import Footer       from "@/components/Footer";
import { getAdminConfig } from "@/app/actions/adminActions";

export default async function HomePage() {
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};

  return (
    <div className="min-h-screen bg-[#F0F4F9] font-sans antialiased selection:bg-[#E8600A] selection:text-white">
      <GlobalNavbar />
      <HomeClient siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
