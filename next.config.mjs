/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Add this if you want to support images from external domains
      domains: ['example.com'], // Replace with the domains you want to allow (for example, "cdn.example.com")
  
      // Disable image optimization, use this if you don't want Next.js to optimize your images
      unoptimized: true, 
  
      // If you're using local images for placeholders (like "/course-placeholder.jpg")
      // this will allow Next.js to serve them without optimization
      // (use this carefully based on your needs)
    },
  };
  
  export default nextConfig;
  