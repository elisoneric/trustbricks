import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Facebook, Twitter, Linkedin, Building } from './Icons';

export default function Footer({ siteSettings }: { siteSettings?: any } = {}) {
  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Mortgage Advisory', href: '/mortgage-advisory' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
  ];

  const legalLinks = [
    { label: 'PenCom Guidelines', href: '/pencom-guidelines' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'FAQ & Help Center', href: '/faq' },
    { label: 'Contact Support', href: '/contact' },
  ];

  return (
    <footer className="bg-[var(--color-ink-700)] text-white pt-24 pb-12">
      {/* Brick-course top rule — the site's one signature structural motif */}
      <div className="divider-brick" aria-hidden="true" style={{ ['--brick-line' as any]: 'var(--color-clay-500)' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 mt-16">

        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <img src="/logo.png?v=3" alt="" aria-hidden="true" className="h-10 w-auto select-none" />
             <span className="font-extrabold text-[16px] leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
               TRUST BRICKS<span className="text-[var(--color-clay-500)]">.</span>
             </span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Empowering Nigerian professionals to unlock their RSA equity and secure their dream homes with absolute transparency and ease.
          </p>
          <div className="text-xs text-white/50 space-y-1 font-tabular">
            <p>Email: {siteSettings?.companyEmail || "hq@trustbrickproperties.ng"}</p>
            <p>Phone: {siteSettings?.companyPhone || "+234 800-TRUSTBRICKS"}</p>
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <a href="https://facebook.com/trustbricksproperties" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook /></a>
            <a href="https://x.com/trustbricksprop" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter /></a>
            <a href="https://linkedin.com/company/trustbricksproperties" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6" style={{ fontFamily: "var(--font-display)" }}>Company</h4>
          <ul className="space-y-4 text-white/50 text-sm font-medium">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[var(--color-clay-200)] transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-[1px] bg-[var(--color-clay-500)] transition-all duration-300 group-hover:w-3"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6" style={{ fontFamily: "var(--font-display)" }}>Legal & Support</h4>
          <ul className="space-y-4 text-white/50 text-sm font-medium">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[var(--color-clay-200)] transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-[1px] bg-[var(--color-clay-500)] transition-all duration-300 group-hover:w-3"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Regional Hubs */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6" style={{ fontFamily: "var(--font-display)" }}>Regional Hubs</h4>
          <ul className="space-y-4 text-white/50 text-sm font-medium">
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-clay-500)] mt-1"><Building /></span>
              <div>
                <p className="text-white font-semibold">Abuja Office (HQ)</p>
                <p className="text-xs mt-1">Plot 234, Wuse Zone 5, FCT</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-white/40 mt-1"><Building /></span>
              <div>
                <p className="text-white font-semibold">Lagos Hub</p>
                <p className="text-xs mt-1">14 Broad Street, Lagos Island</p>
              </div>
            </li>
            <li className="flex flex-wrap gap-2 mt-6 max-w-xs">
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Abuja</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Lagos</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Kano</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Kwara</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Yola</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Benue</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Ogun</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Lokoja</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Calabar</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Minna</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Ibadan</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Ekiti</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Bauchi</span>
               <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Kaduna</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 font-medium">
        <p className="font-tabular">TRUST BRICKS PROPERTIES LTD. © 2026 (RC: 9552712). All rights reserved.</p>
        <p className="flex items-center gap-2">
          <ShieldCheck /> Regulated and Compliant with PenCom RSA Guidelines.
        </p>
      </div>
    </footer>
  );
}
