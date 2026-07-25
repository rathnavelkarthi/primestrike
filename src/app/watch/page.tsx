"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERRORS: Record<string, string> = {
  missing: "No access token provided.",
  invalid: "This link is not valid.",
  expired: "This link has expired.",
  used: "This link has already been used. Each link works only once.",
  sign: "Could not load the video. Please contact support.",
};

function WatchInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (error) return;

    // Soft anti-capture deterrents. NOTE: none of these can stop a
    // determined screen recorder or a phone camera — they only raise effort.
    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        k === "printscreen" ||
        (e.ctrlKey && (k === "s" || k === "u" || k === "p")) ||
        (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c"))
      ) {
        e.preventDefault();
      }
    };
    const blockCtx = (e: MouseEvent) => e.preventDefault();

    // Pause + blur when tab/window loses focus (common during capture setup).
    const onVisibility = () => {
      if (document.hidden) {
        videoRef.current?.pause();
        setBlocked(true);
      } else {
        setBlocked(false);
      }
    };

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", blockCtx);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("contextmenu", blockCtx);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [error]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-white mb-3">Access unavailable</h1>
          <p className="text-neutral-400">{ERRORS[error] || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-10 bg-black">
      <div className="relative w-full max-w-4xl select-none">
        <video
          ref={videoRef}
          src="/api/video/stream"
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          autoPlay
          className="w-full rounded-xl border border-neutral-800 bg-black"
        />
        {blocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/95 text-neutral-300 text-sm">
            Playback paused — return to this tab to continue.
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-neutral-500 text-center max-w-md">
        This is a private, one-time viewing. Recording or sharing is prohibited.
      </p>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-black" />}>
      <WatchInner />
    </Suspense>
  );
}
