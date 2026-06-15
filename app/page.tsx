"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticationStatus } from "@nhost/nextjs";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1 items-end h-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="wave-bar" style={{ height: "24px", animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Background gradient orbs */}
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      <div className="fade-in" style={{ textAlign: "center", maxWidth: "560px", position: "relative", zIndex: 1 }}>
        {/* Logo mark */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", boxShadow: "0 0 40px var(--accent-glow)"
          }}>
            🎙️
          </div>
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "1rem",
          background: "linear-gradient(135deg, var(--text) 40%, var(--accent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          VoiceScribe
        </h1>

        <p style={{
          fontSize: "1.2rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
          fontWeight: 400
        }}>
          Real-time voice transcription powered by Deepgram AI. Speak and watch your words appear instantly.
        </p>

        {/* Wave visualizer preview */}
        <div style={{
          display: "flex", gap: "5px", justifyContent: "center", alignItems: "flex-end",
          height: "40px", marginBottom: "2.5rem"
        }}>
          {[28, 36, 24, 40, 20, 36, 28, 16, 32, 24, 38, 20, 34].map((h, i) => (
            <span key={i} className="wave-bar" style={{
              height: `${h}px`,
              animationDelay: `${i * 0.06}s`,
              opacity: 0.7
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{
            padding: "0.875rem 2rem",
            background: "linear-gradient(135deg, var(--accent), #8b82ff)",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 24px var(--accent-glow)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "inline-block"
          }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px var(--accent-glow)";
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px var(--accent-glow)";
            }}
          >
            Get Started Free
          </Link>
          <Link href="/login" style={{
            padding: "0.875rem 2rem",
            background: "var(--surface)",
            color: "var(--text)",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            border: "1px solid var(--border)",
            transition: "border-color 0.2s, background 0.2s",
            display: "inline-block"
          }}>
            Sign In
          </Link>
        </div>

        {/* Feature badges */}
        <div style={{
          display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
          marginTop: "3rem"
        }}>
          {["⚡ Real-time", "🔒 Secure Auth", "🎯 High Accuracy"].map((feat) => (
            <span key={feat} style={{
              padding: "0.375rem 0.875rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "var(--text-muted)"
            }}>{feat}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
