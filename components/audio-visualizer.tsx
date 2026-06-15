"use client";

interface AudioVisualizerProps {
  isRecording: boolean;
  audioLevel: number;
}

export function AudioVisualizer({ isRecording, audioLevel }: AudioVisualizerProps) {
  const barCount = 20;

  return (
    <div style={{
      display: "flex",
      gap: "3px",
      alignItems: "flex-end",
      height: "48px",
      justifyContent: "center",
    }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const center = barCount / 2;
        const distFromCenter = Math.abs(i - center) / center;
        const baseHeight = isRecording
          ? Math.max(4, audioLevel * (1 - distFromCenter * 0.6) * 0.48 + Math.random() * audioLevel * 0.2)
          : 4;

        return (
          <div
            key={i}
            style={{
              width: "3px",
              height: `${Math.min(48, baseHeight)}px`,
              background: isRecording
                ? `hsl(${245 + i * 3}, 80%, ${55 + audioLevel * 0.3}%)`
                : "var(--border)",
              borderRadius: "2px",
              transition: isRecording ? "height 0.08s ease" : "height 0.3s ease, background 0.3s ease",
              transformOrigin: "bottom",
            }}
          />
        );
      })}
    </div>
  );
}
