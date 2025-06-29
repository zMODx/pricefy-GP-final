/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static exports for GitHub Pages
  output: 'export',
  // Configure basePath and assetPrefix if your site is not deployed at the root
  basePath: process.env.NODE_ENV === 'production' ? '/pricefy-GP-final' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pricefy-GP-final/' : '',
  // Disable trailing slash to avoid issues with GitHub Pages
  trailingSlash: false,
}

export default nextConfig
