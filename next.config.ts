>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
import type { NextConfig } from "next";
=======
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
export default nextConfig;
=======
export default nextConfig;
>>>>>>> a802de832ecf0303d3f0d22f51e388794e994d46
