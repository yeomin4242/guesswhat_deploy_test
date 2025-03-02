"use client";

import { useEffect, useRef, useState } from "react";

interface HorizontalAdSenseProps {
  responsive?: boolean;
}

const HorizontalAdSense: React.FC<HorizontalAdSenseProps> = ({
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Google AdSense 스크립트 한 번만 로드
    const scriptId = "adsbygoogle-init";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const loadAd = () => {
      if (!adRef.current) return;

      // 이미 로드된 광고인 경우 재시도 방지
      if (isAdLoaded) {
        console.log("[HorizontalAdSense] Already loaded (isAdLoaded=true).");
        return;
      }
      if (adRef.current.getAttribute("data-ad-status") === "done") {
        console.log(
          "[HorizontalAdSense] Already loaded (data-ad-status=done).",
        );
        setIsAdLoaded(true);
        return;
      }

      // 컨테이너 너비가 0이면 레이아웃이 완료될 때까지 대기
      if (adRef.current.offsetWidth === 0) {
        console.warn(
          "[HorizontalAdSense] Container width is 0, retrying in 1000ms...",
        );
        return setTimeout(loadAd, 1000);
      }

      // 광고 로드 (push)
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        setIsAdLoaded(true);
        console.log("[HorizontalAdSense] AdSense loaded successfully!");
      } catch (err) {
        console.error("[HorizontalAdSense] AdSense error:", err);
      }
    };

    // ResizeObserver로 컨테이너 크기 변화를 감지
    const observer = new ResizeObserver(() => {
      if (adRef.current && adRef.current.offsetWidth > 0 && !isAdLoaded) {
        loadAd();
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    // 초기 로드 시도 (1.5초 후)
    const timer = setTimeout(loadAd, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [isAdLoaded]);

  return (
    <div className="my-4 flex w-full justify-center">
      {/* 
        광고가 부모 폭 100%로 반응형 표시,
        높이는 자동 (data-full-width-responsive="true" + auto height)
      */}
      <div className="mx-auto w-full max-w-full">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%", // 부모의 너비를 따라감
            height: "auto", // 높이는 auto
            minHeight: "40px",
          }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
          data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HORIZON_SLOT}
          data-ad-format="auto"
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default HorizontalAdSense;
