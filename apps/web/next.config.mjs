/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@wanderloom/api",
    "@wanderloom/config",
    "@wanderloom/db",
    "@wanderloom/domain",
    "@wanderloom/ui",
    "@wanderloom/validation",
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
};

export default nextConfig;
