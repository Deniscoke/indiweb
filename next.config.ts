import type { NextConfig } from "next";
import { PRODUCTION_URL } from "./content/site";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // aria.indiweb.cz is Aria's short address; her page lives on the main site.
      {
        source: "/:path*",
        has: [{ type: "host", value: "aria.indiweb.cz" }],
        destination: `${PRODUCTION_URL}/aria`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
