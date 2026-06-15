"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticationStatus, useUserData, useSignOut } from "@nhost/nextjs";
import { useDeepgramTranscription } from "@/lib/use-deepgram-transcription";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { TranscriptDisplay } from "@/components/transcript-display";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signOut } = useSignOut();

  const {
    recordingState,
    segments,
    interimText,
    errorMessage,
    audioLevel,
    fullTranscript,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useDeepgramTranscription();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleCopyTranscript = () => {
    if (fullTranscript) {
      navigator.clipboard.writeText(fullTranscript);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "32px" }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="wave-bar" style={{ height: "24px", animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const isRecording = recordingState === "recording";
  const isStarting = recordingState === "starting";
  const isStopping = recordingState === "stopping";
  const wordCount = fullTranscript.trim() ? fullTranscript.trim().split(/\s+/).length : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "10%", right: "-5%",
          width: "400px", height: "400px",
          background: isRecording
            ? "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          transition: "background 0.5s ease",
        }} />
      </div>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,10,15,0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem",
            }}>
              🎙️
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
              VoiceScribe
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: "0.375rem 0.875rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, maxWidth: "900px", width: "100%", margin: "0 auto",
        padding: "2rem 1.5rem",
        display: "flex", flexDirection: "column", gap: "1.5rem",
        position: "relative", zIndex: 1,
      }}>
        {/* Page title */}
        <div>
          <h1 style={{
            fontSize: "1.75rem", fontWeight: 700,
            letterSpacing: "-0.02em", marginBottom: "0.375rem"
          }}>
            Live Transcription
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Click Start Recording and speak — your words appear here in real time.
          </p>
        </div>

        {/* Recording control panel */}
        <div style={{
          background: "var(--surface)",
          border: `1px solid ${isRecording ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
          borderRadius: "16px",
          padding: "1.5rem",
          transition: "border-color 0.3s ease",
          boxShadow: isRecording ? "0 0 30px rgba(108,99,255,0.08)" : "none",
        }}>
          {/* Visualizer */}
          <div style={{ marginBottom: "1.5rem" }}>
            <AudioVisualizer isRecording={isRecording} audioLevel={audioLevel} />
          </div>

          {/* Status label */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", marginBottom: "1.5rem"
          }}>
            {isRecording && (
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#ff4444",
                display: "inline-block",
                animation: "pulse-ring 1s ease infinite",
              }} />
            )}
            <span style={{
              fontSize: "0.85rem", fontWeight: 500,
              color: isRecording ? "var(--text)" : "var(--text-muted)",
            }}>
              {isRecording
                ? "Recording — speak now"
                : isStarting
                  ? "Requesting microphone..."
                  : isStopping
                    ? "Stopping..."
                    : "Ready to record"}
            </span>
          </div>

          {/* Main record button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isStarting || isStopping}
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                border: "none", cursor: isStarting || isStopping ? "not-allowed" : "pointer",
                background: isRecording
                  ? "linear-gradient(135deg, #ff4444, #ff6b6b)"
                  : "linear-gradient(135deg, var(--accent), #8b82ff)",
                color: "white",
                fontSize: "1.8rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isRecording
                  ? "0 0 0 0 rgba(255,68,68,0.4), 0 4px 20px rgba(255,68,68,0.3)"
                  : "0 4px 24px var(--accent-glow)",
                transition: "transform 0.15s ease, box-shadow 0.3s ease",
                animation: isRecording ? "none" : undefined,
                position: "relative",
              }}
              onMouseOver={e => {
                if (!isStarting && !isStopping) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.06)";
                }
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isStarting ? "⌛" : isRecording ? "⏹️" : "🎤"}
            </button>
          </div>

          <p style={{
            textAlign: "center", marginTop: "1rem",
            fontSize: "0.78rem", color: "var(--text-muted)"
          }}>
            {isRecording ? "Click to stop" : "Click to start recording"}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="fade-in" style={{
            padding: "0.875rem 1rem",
            background: "rgba(255,107,107,0.08)",
            border: "1px solid rgba(255,107,107,0.25)",
            borderRadius: "10px",
            color: "var(--error)",
            fontSize: "0.875rem",
            display: "flex", gap: "0.5rem", alignItems: "center",
          }}>
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {/* Transcript card */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          minHeight: "320px",
        }}>
          {/* Card header */}
          <div style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Transcript</span>
              {wordCount > 0 && (
                <span style={{
                  fontSize: "0.75rem", color: "var(--text-muted)",
                  background: "var(--surface-2)",
                  padding: "0.2rem 0.6rem", borderRadius: "999px",
                  border: "1px solid var(--border)"
                }}>
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {fullTranscript && (
                <button
                  onClick={handleCopyTranscript}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "7px",
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "var(--text)"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                >
                  Copy
                </button>
              )}
              {(segments.length > 0 || interimText) && (
                <button
                  onClick={clearTranscript}
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "7px",
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "var(--error)"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <TranscriptDisplay
            segments={segments}
            interimText={interimText}
            isRecording={isRecording}
          />
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { label: "Segments", value: segments.length, icon: "📝" },
            { label: "Words", value: wordCount, icon: "💬" },
            { label: "Status", value: isRecording ? "Live" : "Idle", icon: "📡" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>{icon}</div>
              <div style={{
                fontSize: "1.25rem", fontWeight: 700,
                color: label === "Status" && isRecording ? "var(--accent-2)" : "var(--text)",
                letterSpacing: "-0.02em",
              }}>
                {value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1rem 1.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
      }}>
        Powered by Deepgram Nova-2 · Secured by Nhost
      </footer>
    </div>
  );
}
