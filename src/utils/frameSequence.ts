import { IMAGES } from '../data/salonData';

export interface SequenceConfig {
  /**
   * Number of extracted video frames when using custom sequence files in /public/frames/.
   * Easily scalable to 60, 120, or 240+ frames.
   */
  totalFrames: number;
  /**
   * Base path inside /public/ (e.g. '/frames/frame_' -> '/frames/frame_0001.webp')
   */
  basePath: string;
  /**
   * Zero-padding width for frame filenames (e.g. 4 -> 0001)
   */
  padLength: number;
  /**
   * Preferred modern formats probed in order when checking for custom frame sequences
   */
  candidateExtensions: readonly ('avif' | 'webp' | 'jpg')[];
  /**
   * Number of initial frames to preload before activating sequence playback
   */
  initialPreloadCount: number;
}

export const SEQUENCE_CONFIG: SequenceConfig = {
  totalFrames: 90,
  basePath: '/frames/frame_',
  padLength: 4,
  candidateExtensions: ['avif', 'webp', 'jpg'],
  initialPreloadCount: 10,
};

export function formatFrameUrl(
  index: number,
  extension: string,
  config: SequenceConfig = SEQUENCE_CONFIG
): string {
  const frameNumber = String(index + 1).padStart(config.padLength, '0');
  return `${config.basePath}${frameNumber}.${extension}`;
}

export function loadImageAsset(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export interface SequenceManifest {
  enabled: boolean;
  totalFrames: number;
  extension: 'avif' | 'webp' | 'jpg';
  basePath: string;
  padLength: number;
}

/**
 * Checks /frames/manifest.json first so static deployments on Netlify
 * do not trigger 404 image probe errors when using the built-in continuous shot.
 */
export async function resolveSequenceConfig(
  defaults: SequenceConfig = SEQUENCE_CONFIG
): Promise<{ active: boolean; extension: 'avif' | 'webp' | 'jpg'; config: SequenceConfig }> {
  try {
    const res = await fetch('/frames/manifest.json', { cache: 'no-cache' });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const manifest = (await res.json()) as Partial<SequenceManifest>;
      if (manifest.enabled) {
        const ext = manifest.extension || 'webp';
        const mergedConfig: SequenceConfig = {
          ...defaults,
          totalFrames: Number(manifest.totalFrames) > 0 ? Number(manifest.totalFrames) : defaults.totalFrames,
          basePath: manifest.basePath || defaults.basePath,
          padLength: Number(manifest.padLength) > 0 ? Number(manifest.padLength) : defaults.padLength,
        };
        return { active: true, extension: ext, config: mergedConfig };
      }
      return { active: false, extension: 'webp', config: defaults };
    }
  } catch {
    // Fall back silently to built-in 5-keyframe continuous camera shot
  }

  return { active: false, extension: 'webp', config: defaults };
}

export const KEYFRAME_SOURCES = [
  IMAGES.macroStrands,
  IMAGES.profileFlowing,
  IMAGES.colorBalayage,
  IMAGES.salonInterior,
  IMAGES.heroBrunette,
] as const;

export interface CameraKeyframe {
  scale: number;
  panX: number; // fraction of width
  panY: number; // fraction of height
  brightness: number;
}

const KEYFRAME_CAMERA_CURVES: CameraKeyframe[] = [
  // Phase 1 (0–20%): Extreme close-up macro strands drifting slowly deeper
  { scale: 1.04, panX: -0.015, panY: 0.0, brightness: 0.96 },
  // Phase 2 (20–40%): Orbiting smoothly to shoulder & side profile flowing hair
  { scale: 1.08, panX: 0.02, panY: -0.01, brightness: 1.0 },
  // Phase 3 (40–60%): Gentle head turn with dimensional flowing shine
  { scale: 1.06, panX: 0.0, panY: -0.015, brightness: 1.02 },
  // Phase 4 (60–80%): Smooth camera pullback revealing obsidian & brass salon mirrors
  { scale: 1.12, panX: -0.02, panY: 0.01, brightness: 0.92 },
  // Phase 5 (80–100%): Final poised luxury signature portrait composition
  { scale: 1.03, panX: 0.0, panY: 0.0, brightness: 1.0 },
];

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  scale: number,
  panX: number,
  panY: number,
  alpha: number
) {
  if (!img.naturalWidth || !img.naturalHeight || alpha <= 0.002) return;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth * scale;
    drawHeight = drawWidth / imgRatio;
  } else {
    drawHeight = canvasHeight * scale;
    drawWidth = drawHeight * imgRatio;
  }

  const offsetX = (canvasWidth - drawWidth) * 0.5 + panX * canvasWidth;
  const offsetY = (canvasHeight - drawHeight) * 0.5 + panY * canvasHeight;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
}

/**
 * Renders a single continuous virtual camera shot from 5 photographic keyframes
 * when external video sequence frames have not yet been dropped into /public/frames/.
 * Scrubbed 1:1 with scroll progress (forward and backward).
 */
export function renderContinuousShotCanvas(
  ctx: CanvasRenderingContext2D,
  keyframes: HTMLImageElement[],
  width: number,
  height: number,
  progress: number
) {
  const clamped = Math.max(0, Math.min(1, progress));
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#090909';
  ctx.fillRect(0, 0, width, height);

  if (!keyframes.length) return;

  // Map 0..1 across keyframe segments cleanly
  const segmentCount = keyframes.length - 1;
  const scaled = clamped * segmentCount;
  const idxA = Math.min(segmentCount, Math.floor(scaled));
  const idxB = Math.min(segmentCount, idxA + 1);
  const localT = scaled - idxA;

  // Smoothstep easing for seamless optical cross-dissolve
  const blend = localT * localT * (3 - 2 * localT);

  const imgA = keyframes[idxA];
  const imgB = keyframes[idxB];
  const camA = KEYFRAME_CAMERA_CURVES[idxA];
  const camB = KEYFRAME_CAMERA_CURVES[idxB];

  // Continuous camera push/pull across the segment
  const zoomA = camA.scale + localT * 0.065;
  const panXA = camA.panX + localT * 0.024;
  const panYA = camA.panY - localT * 0.012;

  const zoomB = camB.scale - (1 - localT) * 0.045;
  const panXB = camB.panX - (1 - localT) * 0.018;
  const panYB = camB.panY + (1 - localT) * 0.01;

  if (imgA) {
    drawImageCover(ctx, imgA, width, height, zoomA, panXA, panYA, 1);
  }
  if (imgB && idxB !== idxA) {
    drawImageCover(ctx, imgB, width, height, zoomB, panXB, panYB, blend);
  }

  // Subtle traveling champagne-gold light sweep synchronized with scroll
  const sweepX = width * (0.15 + clamped * 0.72);
  const sweepY = height * (0.35 + Math.sin(clamped * Math.PI) * 0.14);
  const radius = Math.max(width, height) * 0.45;
  const glow = ctx.createRadialGradient(sweepX, sweepY, 0, sweepX, sweepY, radius);
  glow.addColorStop(0, 'rgba(234, 213, 173, 0.11)');
  glow.addColorStop(0.45, 'rgba(201, 168, 117, 0.04)');
  glow.addColorStop(1, 'rgba(9, 9, 9, 0)');

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Editorial vignette & edge scrim for text legibility across every frame
  const vignette = ctx.createLinearGradient(0, 0, 0, height);
  vignette.addColorStop(0, 'rgba(9, 9, 9, 0.48)');
  vignette.addColorStop(0.35, 'rgba(9, 9, 9, 0.12)');
  vignette.addColorStop(0.7, 'rgba(9, 9, 9, 0.28)');
  vignette.addColorStop(1, 'rgba(9, 9, 9, 0.84)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders an exact extracted video frame onto the canvas when custom frames are present.
 */
export function renderExactFrameCanvas(
  ctx: CanvasRenderingContext2D,
  frame: HTMLImageElement,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#090909';
  ctx.fillRect(0, 0, width, height);

  drawImageCover(ctx, frame, width, height, 1.0, 0, 0, 1);

  const scrim = ctx.createLinearGradient(0, 0, 0, height);
  scrim.addColorStop(0, 'rgba(9, 9, 9, 0.4)');
  scrim.addColorStop(0.5, 'rgba(9, 9, 9, 0.1)');
  scrim.addColorStop(1, 'rgba(9, 9, 9, 0.78)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, width, height);
}
