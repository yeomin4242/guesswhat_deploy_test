"use client";

import { useEffect, useState } from "react";

const FoldableHorizontalAdsense: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true); // 광고 표시 여부

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Google AdSense 스크립트 로드 (한 번만 실행)
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
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (err) {
        console.error("[AdSense] Auto Ads error:", err);
      }
    };

    // 초기 광고 로드
    loadAd();

    //// 뷰포트 크기가 변경될 때마다 광고를 재요청하여
    //// 작은 뷰포트에서 새로고침 후 나중에 넓어지면 광고가 렌더링되도록 함
    //const handleResize = () => {
    //  loadAd();
    //};

    //window.addEventListener("resize", handleResize);
    //return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null; // 닫기 버튼 클릭 시 광고 숨김

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white shadow-md">
      <div className="relative flex items-center justify-center">
        <div className="mx-auto w-full">
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              height: "90px",
              minHeight: "50px",
            }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
            data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT}
            data-ad-format="bottom"
            data-full-width-responsive="true"
          />
        </div>
        <button
          className="absolute right-4 top-1 rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-900"
          onClick={() => setIsVisible(false)}
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default FoldableHorizontalAdsense;
