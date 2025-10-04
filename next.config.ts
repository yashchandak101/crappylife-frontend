/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // must be empty for Cloudinary
        pathname: "/**",
      },
    ],
    unoptimized: true, // temporarily disable optimization to confirm
  },
};

module.exports = nextConfig;
