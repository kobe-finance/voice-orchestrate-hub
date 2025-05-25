
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl, createLazyLoadObserver, checkImageFormatSupport, type ImageOptimizationOptions } from '@/utils/imageOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  optimization?: ImageOptimizationOptions;
  fallbackSrc?: string;
  loadingClassName?: string;
  errorClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  optimization = {},
  fallbackSrc,
  className,
  loadingClassName,
  errorClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!optimization.lazy);

  useEffect(() => {
    if (!optimization.lazy) {
      setIsInView(true);
      return;
    }

    const observer = createLazyLoadObserver(() => {
      setIsInView(true);
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [optimization.lazy]);

  useEffect(() => {
    if (!isInView) return;

    const formatSupport = checkImageFormatSupport();
    let optimizedSrc = src;

    // Use the best supported format
    if (optimization.format) {
      if (optimization.format === 'avif' && formatSupport.avif) {
        optimizedSrc = getOptimizedImageUrl(src, { ...optimization, format: 'avif' });
      } else if (optimization.format === 'webp' && formatSupport.webp) {
        optimizedSrc = getOptimizedImageUrl(src, { ...optimization, format: 'webp' });
      } else {
        optimizedSrc = getOptimizedImageUrl(src, optimization);
      }
    } else {
      // Auto-select best format
      if (formatSupport.avif) {
        optimizedSrc = getOptimizedImageUrl(src, { ...optimization, format: 'avif' });
      } else if (formatSupport.webp) {
        optimizedSrc = getOptimizedImageUrl(src, { ...optimization, format: 'webp' });
      } else {
        optimizedSrc = getOptimizedImageUrl(src, optimization);
      }
    }

    setCurrentSrc(optimizedSrc);
  }, [isInView, src, optimization]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      ref={imgRef}
      src={isInView ? currentSrc : ''}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        !isLoaded && !isError && loadingClassName,
        isError && errorClassName,
        isLoaded && 'opacity-100',
        !isLoaded && 'opacity-0',
        className
      )}
      loading={optimization.lazy ? 'lazy' : 'eager'}
      {...props}
    />
  );
};
