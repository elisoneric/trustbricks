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
    <footer className="bg-[#050B14] text-white pt-24 pb-12 border-t-[4px] border-[#E8600A]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#E8600A] rounded-md flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
             </div>
             <span className="font-extrabold text-[16px] leading-none tracking-tight">
               TRUST BRICKS<span className="text-[#E8600A]">.</span>
             </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Empowering Nigerian professionals to unlock their RSA equity and secure their dream homes with absolute transparency and ease.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p>Email: {siteSettings?.companyEmail || "hq@trustbrickproperties.ng"}</p>
            <p>Phone: {siteSettings?.companyPhone || "+234 800-TRUSTBRICKS"}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors"><Facebook /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Company</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#E8600A] transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-[1px] bg-[#E8600A] transition-all duration-300 group-hover:w-3"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Legal & Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#E8600A] transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-[1px] bg-[#E8600A] transition-all duration-300 group-hover:w-3"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Regional Hubs */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Regional Hubs</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li className="flex items-start gap-3">
              <span className="text-[#E8600A] mt-1"><Building /></span>
              <div>
                <p className="text-white font-semibold">Abuja Office (HQ)</p>
                <p className="text-xs mt-1">Plot 234, Wuse Zone 5, FCT</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-slate-600 mt-1"><Building /></span>
              <div>
                <p className="text-white font-semibold">Lagos Hub</p>
                <p className="text-xs mt-1">14 Broad Street, Lagos Island</p>
              </div>
            </li>
            <li className="flex gap-4 mt-6">
               <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">Adamawa</span>
               <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">Kaduna</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <p>TRUST BRICKS PROPERTIES LTD. © 2026 (RC: 9552712). All rights reserved.</p>
        <p className="flex items-center gap-2">
          <ShieldCheck /> Regulated and Compliant with PenCom RSA Guidelines.
        </p>
      </div>
    </footer>
  );
}
