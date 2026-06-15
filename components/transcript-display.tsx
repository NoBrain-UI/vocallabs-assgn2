"use client";

import { useEffect, useRef } from "react";
import type { TranscriptSegment } from "@/lib/use-deepgram-transcription";

interface TranscriptDisplayProps {
  segments: TranscriptSegment[];
  interimText: string;
  isRecording: boolean;
}

export function TranscriptDisplay({ segments, interimText, isRecording }: TranscriptDisplayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments, interimText]);

  const isEmpty = segments.length === 0 && !interimText;

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      minHeight: "200px",
    }}>
      {isEmpty ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)", textAlign: "center",
          padding: "3rem 1rem",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>🎤</div>
          <p style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
            {isRecording ? "Listening..." : "Ready to transcribe"}
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.7, maxWidth: "280px", lineHeight: 1.5 }}>
            {isRecording
              ? "Start speaking — your words will appear here in real time"
              : "Press Start Recording and begin speaking"}
          </p>
        </div>
      ) : (
        <>
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              className="fade-in"
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                animationDelay: `${idx === segments.length - 1 ? "0ms" : "0ms"}`,
              }}
            >
              <span style={{
                flexShrink: 0,
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                marginTop: "0.55rem",
              }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  fontWeight: 400,
                }}>
                  {seg.text}
                </p>
                <span style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                  display: "block",
                }}>
                  {seg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {/* Interim (live) text */}
          {interimText && (
            <div style={{
              display: "flex", gap: "0.75rem", alignItems: "flex-start"
            }}>
              <span style={{
                flexShrink: 0,
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "var(--accent-2)",
                marginTop: "0.55rem",
                animation: "pulse-ring 1s ease infinite",
              }} />
              <p className="text-shimmer" style={{
                flex: 1,
                fontSize: "1.05rem",
                lineHeight: 1.7,
                fontWeight: 400,
              }}>
                {interimText}
              </p>
            </div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
