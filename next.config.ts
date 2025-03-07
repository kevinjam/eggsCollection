import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',  // Specify where to output the service worker and assets
  register: true,  // Register the service worker
  skipWaiting: true,
    // Skip waiting when a new service worker is available
  // reactStrictMode: true,  // Uncomment this line if you want to enable React Strict Mode
});
