"use client";

import { useEffect, useRef, useState } from "react";

interface VerticalAdSenseProps {
  responsive?: boolean;
  position?: "left" | "right";
}

const VerticalAdSense: React.FC<VerticalAdSenseProps> = ({
  responsive = true,
  position = "left",
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  // 이미 push가 호출되었는지 추적하는 ref
  const hasPushedRef = useRef(false);
  // 창 너비가 1536px(2xl) 이상인지 추적하는 상태
  const [isLarge, setIsLarge] = useState(false);

  // 창 resize 이벤트로 isLarge 상태 업데이트
  useEffect(() => {
    const updateSize = () => {
      setIsLarge(window.innerWidth >= 1536);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 창이 2xl 미만이면 상태를 초기화하여 재렌더링 시 광고를 다시 로드하도록 함
  useEffect(() => {
    if (!isLarge) {
      hasPushedRef.current = false;
      setIsAdLoaded(false);
    }
  }, [isLarge]);

  // 뷰포트가 2xl 이상일 때만 광고 로드
  useEffect(() => {
    if (!isLarge) return;
    if (typeof window === "undefined") return;

    // Google AdSense 스크립트를 한 번만 로드
    if (!document.querySelector("#adsbygoogle-init")) {
      const script = document.createElement("script");
      script.id = "adsbygoogle-init";
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const loadAd = () => {
      if (!adRef.current) return;
      if (hasPushedRef.current) return; // 이미 push된 경우 건너뜀

      // 이미 로드된 경우
      if (adRef.current.getAttribute("data-ad-status") === "done") {
        hasPushedRef.current = true;
        setIsAdLoaded(true);
        return;
      }

      // 컨테이너 너비가 0이면 재시도
      if (adRef.current.offsetWidth <= 0) {
        setTimeout(loadAd, 1000);
        return;
      }

      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        hasPushedRef.current = true;
        setIsAdLoaded(true);
      } catch (err) {
        console.error("AdSense error:", err);
      }
    };

    // ResizeObserver로 광고 컨테이너 크기 변화를 감지하여 광고 로드
    const observer = new ResizeObserver(() => {
      if (
        adRef.current &&
        adRef.current.offsetWidth > 0 &&
        !hasPushedRef.current
      ) {
        loadAd();
      }
    });
    if (adRef.current) {
      observer.observe(adRef.current);
    }

    // 창 리사이즈 이벤트 (2xl 이상이면 재호출)
    const handleResize = () => {
      if (
        window.innerWidth >= 1536 &&
        adRef.current &&
        adRef.current.offsetWidth > 0 &&
        !hasPushedRef.current
      ) {
        loadAd();
      }
    };
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(loadAd, 1500);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [responsive, position, isLarge]);

  if (!isLarge) return null;

  return (
    <div
      className={`fixed top-[55%] w-[160px] -translate-y-1/2 ${
        position === "left" ? "left-4" : "right-4"
      }`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "160px",
          height: "600px",
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_VERTICAL_SLOT}
        data-ad-format="vertical"
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default VerticalAdSense;
