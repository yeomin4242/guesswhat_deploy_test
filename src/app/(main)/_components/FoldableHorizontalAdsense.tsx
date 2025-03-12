import Script from "next/script";

const FoldableHorizontalAdsense = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      id="adsense"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
};

export default FoldableHorizontalAdsense;
