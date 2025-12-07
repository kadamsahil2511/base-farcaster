/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub native-only modules that some deps optionally import
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    }
    
    // Handle the porto/katana chain issue by ignoring the warning
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /porto/,
        message: /export 'katana'/,
      },
    ]
    
    return config
  },
};

export default nextConfig;
