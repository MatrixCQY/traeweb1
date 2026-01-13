import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Ensure basePath matches the repository name
  basePath: "/traeweb1",
  // Optional: assetPrefix usually defaults to basePath, but setting it explicitly can help
  assetPrefix: "/traeweb1/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
