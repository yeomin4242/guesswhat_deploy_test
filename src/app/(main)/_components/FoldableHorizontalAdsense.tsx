"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const FoldableHorizontalAdsense = ({ responsive = true, style = {} }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Initialize ads when script is loaded
  useEffect(() => {
    if (scriptLoaded && !adLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error("AdSense push error:", error);
      }
    }
  }, [scriptLoaded, adLoaded]);

  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7219773941395265"
        crossOrigin="anonymous"
        onLoad={() => {
          console.log("AdSense script loaded successfully");
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error("AdSense script failed to load", e);
        }}
      />
      <div className="ad-container">
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            ...style,
          }}
          data-ad-client="ca-pub-7219773941395265"
          data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_VERTICAL_SLOT}
          data-ad-format="auto"
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
      44
    </>
  );
};

export default FoldableHorizontalAdsense;
