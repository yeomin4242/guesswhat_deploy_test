import Script from "next/script";
import { useEffect, useState } from "react";

const FoldableHorizontalAdsense: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [adsLoaded, setAdsLoaded] = useState(false);

  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "";
  const adSlot = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HORIZON_SLOT || "";

  useEffect(() => {
    // window.adsbygoogle가 존재하고 광고 스크립트가 로드된 경우에만 광고 푸시
    if (window.adsbygoogle && adsLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log("Ad push attempted");
      } catch (error) {
        console.error("Error pushing ad:", error);
      }
    }
  }, [adsLoaded]);

  // 광고가 보이지 않을 때는 컴포넌트를 렌더링하지 않음
  if (!isVisible) return null;

  // 환경 변수 확인을 위한 로그
  console.log("Ad Client:", adClient);
  console.log("Ad Slot:", adSlot);

  return (
    <>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("AdSense script loaded");
          setAdsLoaded(true);
        }}
        onError={(e) => {
          console.error("AdSense script error:", e);
        }}
      />

      <div className="fixed bottom-0 left-0 z-50 w-full bg-white shadow-md">
        <div className="relative flex items-center justify-center">
          <div className="mx-auto w-full">
            {adClient && adSlot && (
              <ins
                className="adsbygoogle"
                style={{
                  display: "block",
                  width: "100%",
                  height: "90px",
                  minHeight: "50px",
                }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            )}
          </div>
          <button
            className="absolute right-4 top-1 rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-900"
            onClick={() => setIsVisible(false)}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </>
  );
};

export default FoldableHorizontalAdsense;
