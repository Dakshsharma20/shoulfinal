/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Placeholder artwork in /public/images is SVG. next/image blocks SVG
    // optimization by default (XSS precaution) so it must be explicitly
    // allowed here. Safe in this project since all SVGs are our own
    // locally-generated, static, script-free files.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Product/category/settings images uploaded through the admin panel
    // are served from Cloudinary.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
