/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn'],
    localeDetection: false
  },
};

module.exports = nextConfig;
