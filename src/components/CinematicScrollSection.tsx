import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { IMAGES, STORYBOARD_PHASES } from '../data/salonData';
import {
  SEQUENCE_CONFIG,
  KEYFRAME_SOURCES,
  resolveSequenceConfig,
  formatFrameUrl,
  loadImageAsset,
  renderContinuousShotCanvas,
  renderExactFrameCanvas,
} from '../utils/frameSequence';

gsap.registerPlugin(ScrollTrigger);

interface CinematicScrollSectionProps {
  onDiscoverServices: () => void;
}

export function CinematicScrollSection({ onDiscoverServices }: CinematicScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const keyframesRef = useRef<HTMLImageElement[]>([]);
  const customFramesRef = useRef<(HTMLImageElement | null)[]>([]);
  const isCustomSequenceRef = useRef(false);

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Redraw canvas for the current scroll progress via requestAnimationFrame
  const scheduleDraw = () => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCanvasFailed(true);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      if (!cssWidth || !cssHeight) return;

      const targetW = Math.round(cssWidth * dpr);
      const targetH = Math.round(cssHeight * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const progress = progressRef.current;

      if (isCustomSequenceRef.current && customFramesRef.current.length > 0) {
        const total = customFramesRef.current.length;
        const targetIndex = Math.min(total - 1, Math.max(0, Math.round(progress * (total - 1))));
        let frame = customFramesRef.current[targetIndex];
        // Graceful fallback to nearest preloaded frame if user scrubs quickly ahead of progressive loader
        if (!frame) {
          for (let offset = 1; offset < total; offset++) {
            if (customFramesRef.current[targetIndex - offset]) {
              frame = customFramesRef.current[targetIndex - offset];
              break;
            }
            if (customFramesRef.current[targetIndex + offset]) {
              frame = customFramesRef.current[targetIndex + offset];
              break;
            }
          }
        }
        if (frame) {
          renderExactFrameCanvas(ctx, frame, canvas.width, canvas.height);
          return;
        }
      }

      if (keyframesRef.current.length > 0) {
        renderContinuousShotCanvas(
          ctx,
          keyframesRef.current,
          canvas.width,
          canvas.height,
          progress
        );
      }
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onMotionChange);

    let isCancelled = false;

    const initAssets = async () => {
      // 1. Load the 5 photographic keyframes immediately so canvas is instantaneously responsive
      const loadedKeyframes = await Promise.all(
        KEYFRAME_SOURCES.map((src) => loadImageAsset(src).catch(() => null))
      );
      if (isCancelled) return;
      keyframesRef.current = loadedKeyframes.filter(
        (img): img is HTMLImageElement => img !== null
      );
      scheduleDraw();

      // 2. Check /frames/manifest.json for enabled custom sequence frames
      const resolved = await resolveSequenceConfig(SEQUENCE_CONFIG);
      if (!resolved.active || isCancelled) return;

      const { extension, config } = resolved;
      const total = config.totalFrames;
      customFramesRef.current = new Array<HTMLImageElement | null>(total).fill(null);

      // Preload first N frames eagerly before switching active mode
      const initialCount = Math.min(config.initialPreloadCount, total);
      await Promise.all(
        Array.from({ length: initialCount }, (_, i) =>
          loadImageAsset(formatFrameUrl(i, extension, config))
            .then((img) => {
              customFramesRef.current[i] = img;
            })
            .catch(() => undefined)
        )
      );

      if (isCancelled) return;
      if (customFramesRef.current[0]) {
        isCustomSequenceRef.current = true;
        scheduleDraw();
      }

      // Progressively load remaining frames in gentle batches without blocking main thread
      const batchSize = 8;
      for (let start = initialCount; start < total; start += batchSize) {
        if (isCancelled) break;
        const end = Math.min(total, start + batchSize);
        await Promise.all(
          Array.from({ length: end - start }, (_, offset) => {
            const frameIdx = start + offset;
            return loadImageAsset(formatFrameUrl(frameIdx, extension, config))
              .then((img) => {
                customFramesRef.current[frameIdx] = img;
              })
              .catch(() => undefined);
          })
        );
      }
    };

    initAssets();

    const handleResize = () => scheduleDraw();
    window.addEventListener('resize', handleResize);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && canvasRef.current
        ? new ResizeObserver(() => scheduleDraw())
        : null;
    if (resizeObserver && canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      isCancelled = true;
      mediaQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          scheduleDraw();

          const pct = Math.round(p * 100);
          setScrollPercent(pct);

          const phaseIdx = Math.min(
            STORYBOARD_PHASES.length - 1,
            Math.max(0, Math.floor(p * STORYBOARD_PHASES.length))
          );
          setActivePhaseIndex((prev) => (prev !== phaseIdx ? phaseIdx : prev));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const activePhase = STORYBOARD_PHASES[activePhaseIndex];

  const handleManualPhaseSelect = (idx: number) => {
    setActivePhaseIndex(idx);
    const targetProgress = idx / (STORYBOARD_PHASES.length - 1);
    progressRef.current = targetProgress;
    setScrollPercent(Math.round(targetProgress * 100));
    scheduleDraw();
  };

  return (
    <section
      id="cinematic-experience"
      ref={containerRef}
      aria-label="Cinematic Hair Transformation Experience"
      className={`relative w-full bg-[#090909] ${
        reducedMotion ? 'min-h-[100svh]' : 'h-[280vh]'
      }`}
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden">
        {/* HTML5 Canvas Frame Renderer */}
        {!canvasFailed ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        ) : (
          <img
            src={IMAGES.heroBrunette}
            alt="Cinematic portrait of glossy brunette hair in warm studio light"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Top Bar Info inside Sticky Viewport */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 pt-24 sm:px-8 lg:px-12">
          <span className="text-[11px] font-medium tracking-[0.26em] text-[#EAD5AD]/90 uppercase">
            THE TRANSFORMATION
          </span>
          <span className="font-sans text-[11px] tracking-[0.2em] text-[#AAA39A] tabular-nums">
            {activePhase.phase} / 05 · {String(scrollPercent).padStart(2, '0')}%
          </span>
        </div>

        {/* Center / Lower Editorial Storyboard Typography */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            {/* Active Phase Copy */}
            <div className="lg:col-span-8">
              <p className="mb-3 text-[11px] font-medium tracking-[0.26em] text-[#C9A875] uppercase tabular-nums">
                CHAPTER {activePhase.phase} · {activePhase.rangeLabel}
              </p>

              <h2
                key={activePhase.phase}
                className="font-serif text-[clamp(2rem,4.4vw,4rem)] leading-[1.06] font-normal tracking-[-0.01em] text-[#F3EEE6] transition-opacity duration-500"
              >
                {activePhase.headline}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F3EEE6]/80 sm:text-base">
                {activePhase.subline}
              </p>

              {activePhase.showCta && (
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={onDiscoverServices}
                    className="group inline-flex min-h-[46px] cursor-pointer items-center gap-3 border border-[#C9A875] bg-[#090909]/70 px-6 py-3 text-xs font-medium tracking-[0.2em] text-[#EAD5AD] uppercase whitespace-nowrap backdrop-blur-sm transition-all duration-200 hover:bg-[#C9A875] hover:text-[#090909]"
                  >
                    <span>DISCOVER OUR SERVICES</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Phase Scrubbing Timeline */}
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <div className="flex w-full max-w-xs items-center gap-2">
                {STORYBOARD_PHASES.map((phase, idx) => {
                  const isActive = idx === activePhaseIndex;
                  const isPast = idx < activePhaseIndex;
                  return (
                    <button
                      key={phase.phase}
                      type="button"
                      onClick={() => handleManualPhaseSelect(idx)}
                      aria-label={`Jump to chapter ${phase.phase}: ${phase.headline}`}
                      className="group flex h-7 flex-1 cursor-pointer items-center"
                    >
                      <span
                        className={`block h-[2px] w-full transition-all duration-300 ${
                          isActive
                            ? 'bg-[#EAD5AD]'
                            : isPast
                              ? 'bg-[#C9A875]/75'
                              : 'bg-[#F3EEE6]/20 group-hover:bg-[#C9A875]/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] tracking-[0.18em] text-[#AAA39A] uppercase">
                {reducedMotion
                  ? 'Select chapter to explore'
                  : 'Scroll to scrub camera movement'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
