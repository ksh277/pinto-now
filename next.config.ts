import type { NextConfig } from 'next';

const strict = process.env.NEXT_STRICT !== 'false';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: !strict,
  },
  eslint: {
    ignoreDuringBuilds: !strict,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
      config.resolve.alias['@opentelemetry/sdk-node'] = false;
      config.resolve.alias['@genkit-ai/core'] = false;
      config.resolve.alias['genkit'] = false;
      config.resolve.alias['dotprompt'] = false;
      config.resolve.alias['handlebars'] = false;
      config.resolve.alias['canvas'] = false;
    }
    return config;
  },
};

export default nextConfig;
