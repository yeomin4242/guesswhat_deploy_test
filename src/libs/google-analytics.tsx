import Script from "next/script";

const GoogleAnalytics = () => (
  <>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
    />
    <Script id="ga-script" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${process.env.GA_TRACKING_ID}');
      `}
    </Script>
  </>
);

export default GoogleAnalytics;
