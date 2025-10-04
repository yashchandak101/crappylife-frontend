/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "crappylife-backend.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;