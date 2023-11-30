/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_TEST: process.env.NEXT_TEST,
    NEXT_APP_OPENAI_API_KEY: process.env.NEXT_APP_OPENAI_API_KEY,
  },
};

module.exports = nextConfig;
