import { NextConfig } from 'next'

declare module 'next-pwa' {
  function withPWA(nextConfig: NextConfig): NextConfig
  export default withPWA
}
