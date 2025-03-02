import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["dummyimage.com"], // 허용할 외부 이미지 도메인
  },
};

export default nextConfig;
