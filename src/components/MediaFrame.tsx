import { useState, type CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function MediaFrame({
  src,
  alt,
  className = '',
  imgClassName = '',
  style,
  loading = 'lazy',
  fetchPriority = 'auto',
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#11100F] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={style}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#171513] via-[#11100F] to-[#090909] p-6 text-center"
        >
          <Sparkles className="mb-3 h-5 w-5 text-[#C9A875]/70" strokeWidth={1.25} />
          <span className="font-serif text-sm tracking-wide text-[#EAD5AD]/80">LUMIÈRE</span>
          <span className="mt-1 max-w-[22ch] text-xs text-[#AAA39A]">{alt}</span>
        </div>
      )}
    </div>
  );
}
