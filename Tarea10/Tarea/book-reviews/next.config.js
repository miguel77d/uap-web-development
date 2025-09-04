/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["books.google.com", "via.placeholder.com"],
  },
};

module.exports = nextConfig;
