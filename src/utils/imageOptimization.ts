
// Image optimization utilities for WebP/AVIF support
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  lazy?: boolean;
}

// Check browser support for modern image formats
export const checkImageFormatSupport = (): {
  webp: boolean;
  avif: boolean;
} => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return {
    webp: canvas.toDataURL('image/webp').startsWith('data:image/webp'),
    avif: canvas.toDataURL('image/avif').startsWith('data:image/avif')
  };
};

// Generate optimized image URLs
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 80, format } = options;
  
  // If it's a placeholder image, return as is
  if (originalUrl.includes('placeholder.svg')) {
    return originalUrl;
  }
  
  // If it's an Unsplash image, use their optimization
  if (originalUrl.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    if (format) params.append('fm', format);
    
    return `${originalUrl}&${params.toString()}`;
  }
  
  // For other images, return the original URL
  // In a real app, you'd integrate with an image CDN here
  return originalUrl;
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Convert image to WebP format (client-side)
export const convertToWebP = (
  imageFile: File,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          quality
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
};
