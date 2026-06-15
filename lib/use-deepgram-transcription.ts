"use client";

import { useCallback, useRef, useState } from "react";

export type TranscriptSegment = {
  id: string;
  text: string;
  isFinal: boolean;
  timestamp: Date;
};

export type RecordingState = "idle" | "starting" | "recording" | "stopping" | "error";

export function useDeepgramTranscription() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const segmentIdCounter = useRef(0);

  const stopAudioLevel = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setAudioLevel(0);
  }, []);

  const trackAudioLevel = useCallback((analyser: AnalyserNode) => {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setAudioLevel(Math.min(100, (avg / 128) * 100));
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setRecordingState("starting");
      setErrorMessage("");
      setSegments([]);
      setInterimText("");

      // Fetch a short-lived Deepgram key from our API
      const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
      if (!tokenRes.ok) throw new Error("Failed to get transcription token");
      const { key } = await tokenRes.json();

      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up WebSocket to Deepgram
      const params = new URLSearchParams({
        model: "nova-2",
        language: "en-US",
        smart_format: "true",
        interim_results: "true",
        utterance_end_ms: "1000",
        encoding: "linear16",
        sample_rate: "16000",
      });

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params.toString()}`,
        ["token", key]
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setRecordingState("recording");

        // Set up AudioContext to capture PCM
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);

        // Analyser for level meter
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        source.connect(analyser);
        trackAudioLevel(analyser);

        // Script processor to send PCM chunks
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        source.connect(processor);
        processor.connect(audioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const float32 = e.inputBuffer.getChannelData(0);
          // Convert to Int16
          const int16 = new Int16Array(float32.length);
          for (let i = 0; i < float32.length; i++) {
            int16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768));
          }
          ws.send(int16.buffer);
        };
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== "Results") return;

          const transcript = data.channel?.alternatives?.[0]?.transcript ?? "";
          const isFinal = data.is_final ?? false;

          if (!transcript) return;

          if (isFinal) {
            setInterimText("");
            setSegments((prev) => [
              ...prev,
              {
                id: `seg-${segmentIdCounter.current++}`,
                text: transcript,
                isFinal: true,
                timestamp: new Date(),
              },
            ]);
          } else {
            setInterimText(transcript);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setErrorMessage("Connection error with transcription service.");
        setRecordingState("error");
      };

      ws.onclose = () => {
        if (recordingState !== "stopping") {
          setRecordingState("idle");
        }
        setInterimText("");
      };
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.includes("Permission")
            ? "Microphone access denied. Please allow microphone access."
            : err.message
          : "Failed to start recording.";
      setErrorMessage(msg);
      setRecordingState("error");
    }
  }, [trackAudioLevel, recordingState]);

  const stopRecording = useCallback(() => {
    setRecordingState("stopping");
    stopAudioLevel();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setRecordingState("idle");
    setInterimText("");
  }, [stopAudioLevel]);

  const clearTranscript = useCallback(() => {
    setSegments([]);
    setInterimText("");
    segmentIdCounter.current = 0;
  }, []);

  const fullTranscript = segments.map((s) => s.text).join(" ");

  return {
    recordingState,
    segments,
    interimText,
    errorMessage,
    audioLevel,
    fullTranscript,
    startRecording,
    stopRecording,
    clearTranscript,
  };
}
