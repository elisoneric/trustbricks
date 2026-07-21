"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] p-4 sm:p-6">
      <div className="max-w-xl mx-auto bg-[var(--color-ink-700)] text-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow text-sm leading-relaxed">
          <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Cookie Notice</p>
          <p className="text-white/70 text-xs">
            We use essential cookies to operate this site. Optional cookies help us improve your experience.
            See our <a href="/privacy" className="underline text-[var(--color-clay-200)] hover:text-white transition-colors">Privacy Policy</a> for details.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-bold border border-white/20 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-bold bg-[var(--color-clay-500)] hover:bg-[var(--color-clay-600)] rounded-xl transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
