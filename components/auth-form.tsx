"use client";

import { useState } from "react";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string, displayName?: string) => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

export function AuthForm({ mode, onSubmit, error, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, displayName || undefined);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.875rem 1rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "var(--text-muted)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
    }}>
      {/* Background orb */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-30%", right: "-10%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      <div className="fade-in" style={{
        width: "100%", maxWidth: "420px", position: "relative", zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", marginBottom: "1rem",
            boxShadow: "0 0 30px var(--accent-glow)"
          }}>
            🎙️
          </div>
          <h1 style={{
            fontSize: "1.75rem", fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--text)"
          }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {mode === "login"
              ? "Sign in to access your transcriptions"
              : "Start transcribing your voice for free"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "2rem",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {mode === "signup" && (
              <div>
                <label style={labelStyle} htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Jane Doe"
                  style={inputStyle}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            <div>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                required
                minLength={mode === "signup" ? 8 : undefined}
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                borderRadius: "8px",
                color: "var(--error)",
                fontSize: "0.875rem",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: isLoading
                  ? "var(--surface-2)"
                  : "linear-gradient(135deg, var(--accent), #8b82ff)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: isLoading ? "none" : "0 4px 20px var(--accent-glow)",
              }}
            >
              {isLoading
                ? "Please wait..."
                : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {mode === "login" ? (
            <>Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                Sign up free
              </Link>
            </>
          ) : (
            <>Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
