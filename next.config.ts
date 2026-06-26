import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    allowedDevOrigins: ['*.ngrok-free.dev', 'localhost:3000'],
};
module.exports = nextConfig;
export default nextConfig;
