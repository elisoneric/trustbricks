import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import GalleryPageClient from "@/components/GalleryPageClient";
import { getGalleryImages } from "@/app/actions/galleryActions";
import { getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Gallery | Trust Bricks Properties Ltd",
  description: "Photos from Trust Bricks Properties Ltd — our offices, team, properties, and events.",
};

export default async function GalleryPage() {
  const { images } = await getGalleryImages();
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <GalleryPageClient images={images || []} />
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
