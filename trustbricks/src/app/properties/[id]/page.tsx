import { notFound } from "next/navigation";
import Link from "next/link";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { PrismaClient } from "@prisma/client";
import { getAdminConfig } from "@/app/actions/adminActions";
import { MapPin, BedDouble, Bath, Ruler, ArrowLeft, Home } from "lucide-react";

const prisma = new PrismaClient();

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  const config = await getAdminConfig();
  const images: string[] = JSON.parse(property.images || "[]");

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-5xl mx-auto px-6 lg:px-8">
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-clay-500)] transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
          </Link>

          <div className="rounded-3xl overflow-hidden bg-[var(--color-mortar-50)] h-72 md:h-[420px] mb-8 relative">
            {images[0] ? (
              <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                <Home className="w-16 h-16 opacity-30" />
              </div>
            )}
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-bold uppercase tracking-wide">
              {property.category}
            </span>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mb-10">
              {images.slice(1, 5).map((img) => (
                <img key={img} src={img} alt="" className="w-full h-24 object-cover rounded-xl border border-[var(--color-border)]" />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-[var(--color-text-heading)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {property.title}
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {property.address ? `${property.address}, ` : ""}{property.city}, {property.state}
                </p>
              </div>

              {(property.bedrooms || property.bathrooms || property.sizeSqm) && (
                <div className="flex items-center gap-6 py-4 border-y border-[var(--color-border)]">
                  {property.bedrooms ? <span className="flex items-center gap-2 text-sm text-[var(--color-text-body)]"><BedDouble className="w-4 h-4 text-[var(--color-clay-500)]" /> {property.bedrooms} Bedrooms</span> : null}
                  {property.bathrooms ? <span className="flex items-center gap-2 text-sm text-[var(--color-text-body)]"><Bath className="w-4 h-4 text-[var(--color-clay-500)]" /> {property.bathrooms} Bathrooms</span> : null}
                  {property.sizeSqm ? <span className="flex items-center gap-2 text-sm text-[var(--color-text-body)]"><Ruler className="w-4 h-4 text-[var(--color-clay-500)]" /> {property.sizeSqm} m²</span> : null}
                </div>
              )}

              {property.description && (
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed whitespace-pre-line">{property.description}</p>
              )}
            </div>

            <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card h-fit space-y-4">
              <p className="text-2xl font-black text-[var(--color-clay-500)]" style={{ fontFamily: "var(--font-display)" }}>
                {property.priceLabel || (property.price ? `₦${property.price.toLocaleString()}` : "Price on request")}
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                {property.status.replace("_", " ")}
              </span>
              <Link
                href={`/contact?property=${encodeURIComponent(property.title)}`}
                className="block w-full text-center py-3.5 rounded-xl bg-[var(--color-clay-500)] hover:bg-[var(--color-clay-600)] text-white font-bold text-sm transition-all duration-200"
              >
                Enquire About This Property
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
