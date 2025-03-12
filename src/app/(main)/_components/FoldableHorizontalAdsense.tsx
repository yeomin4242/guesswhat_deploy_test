"use client";

import { useEffect, useState } from "react";

const FoldableHorizontalAdsense: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true); // 광고 표시 여부

  useEffect(() => {
    // Initialize adsbygoogle
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
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
            data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HORIZON_SLOT}
            data-ad-format="auto"
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
