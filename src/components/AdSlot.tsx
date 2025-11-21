"use client";
import { useEffect, useRef } from "react";

type Props = {
  adSlotId: string;
  className?: string;
};

export default function AdSlot({ adSlotId, className }: Props) {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      // @ts-expect-error Google defines global on load
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      ref={ref as any}
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client="YOUR_ADSENSE_CLIENT_ID"
      data-ad-slot={adSlotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}


