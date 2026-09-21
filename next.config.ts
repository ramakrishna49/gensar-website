import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      { source: "/about", destination: "/about.html" },
      { source: "/careers", destination: "/careers.html" },
      { source: "/our-services", destination: "/our-services.html" },
      { source: "/gensar-consulting", destination: "/gensar-consulting.html" },
      { source: "/hire-us", destination: "/hire-us.html" },
      { source: "/get-in-touch", destination: "/get-in-touch.html" },
      {
        source: "/share-your-requirement",
        destination: "/share-your-requirement.html",
      },
      { source: "/privacy-policy", destination: "/privacy-policy.html" },
      { source: "/terms-conditions", destination: "/terms-conditions.html" },
      { source: "/cookie-policy", destination: "/cookie-policy.html" },
    ];
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:page.html",
        destination: "/:page",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/api/public/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
