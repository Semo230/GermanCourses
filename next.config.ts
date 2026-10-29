import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Images are already sized and compressed (webp/jpg), so no optimizer is needed.
  images: { unoptimized: true },
  // Old links from before the rebuild keep working.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/quiz.html", destination: "/quiz", permanent: true },
      { source: "/lesson.html", destination: "/lesson", permanent: true },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
