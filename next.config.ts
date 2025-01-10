/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static exports
    basePath: process.env.NODE_ENV === 'production' ? '/ts_next_riyadh_maps' : '',
    images: {
        unoptimized: true,
    },
}

export default nextConfig;
