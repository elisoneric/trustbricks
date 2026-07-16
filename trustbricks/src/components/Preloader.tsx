"use client";

import React, { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Fade out as soon as hydration completes & document is ready
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setLoading(false);
        const removeTimer = setTimeout(() => {
          setShouldRender(false);
        }, 500);
        return () => clearTimeout(removeTimer);
      }, 400); // Slight delay for smooth visual transition
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#EDE7DB",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: loading ? 1 : 0,
        visibility: loading ? "visible" : "hidden",
        transition: "opacity 400ms cubic-bezier(0.25, 1, 0.5, 1), visibility 400ms",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "320px",
          padding: "0 16px",
        }}
      >
        {/* Animated Brand Emblem */}
        <div
          style={{
            position: "relative",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer Ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid rgba(16, 25, 43, 0.08)",
              borderRadius: "50%",
            }}
          />
          {/* Spinning Accent Ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid transparent",
              borderTopColor: "#B8502E",
              borderRadius: "50%",
              animation: "preloader-spin 1s linear infinite",
            }}
          />
          
          {/* Brick Emblem inside */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10192B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: "preloader-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <path d="M3 21h18" />
            <path d="M5 21V9l7-5 7 5v12" />
            <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
          </svg>
        </div>

        {/* Brand Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display), "Bricolage Grotesque", sans-serif',
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#10192B",
            }}
          >
            TRUST BRICKS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body), "Public Sans", sans-serif',
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 600,
              color: "#8A8272",
            }}
          >
            Mortgage Specialist
          </span>
        </div>

        {/* Minimal Progress Line */}
        <div
          style={{
            width: "144px",
            height: "2px",
            backgroundColor: "rgba(16, 25, 43, 0.08)",
            borderRadius: "9999px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              backgroundColor: "#B8502E",
              animation: "preloader-loading 1.5s infinite ease-in-out",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes preloader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes preloader-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(0.95); }
        }
        @keyframes preloader-loading {
          0% { left: -40%; width: 40%; }
          50% { left: 20%; width: 60%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
}
