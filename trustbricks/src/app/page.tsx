import GlobalNavbar from "@/components/GlobalNavbar";
import HomeClient   from "@/components/HomeClient";
import Footer       from "@/components/Footer";
import { getAdminConfig } from "@/app/actions/adminActions";

export default async function HomePage() {
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] font-sans antialiased selection:bg-[var(--color-clay-500)] selection:text-white">
      <GlobalNavbar />
      <HomeClient siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
