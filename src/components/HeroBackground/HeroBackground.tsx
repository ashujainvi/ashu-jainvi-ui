import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { PowerGlitch, type GlitchResult } from 'powerglitch';
import { heroBackgroundSettings as settings } from './heroBackground.config';
import styles from './HeroBackground.module.css';

interface HeroBackgroundProps {
  children?: ReactNode;
  enabled?: boolean;
  intensity?: number;
}

const HeroBackground = ({
  children,
  enabled = true,
  intensity = 1,
}: HeroBackgroundProps) => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const layers = layersRef.current;
    const canvas = noiseRef.current;
    const band = bandRef.current;
    const context = canvas?.getContext('2d');
    if (!background || !layers || !canvas || !context || !band) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let running = false;
    let glitch: GlitchResult | undefined;
    let frame: ImageData | undefined;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let nextBandTime = 0;
    let bandEndTime = 0;

    const randomBetween = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const scheduleBand = (time: number) => {
      band.style.opacity = '0';
      bandEndTime = 0;
      nextBandTime =
        time +
        randomBetween(settings.bands.minDelayMs, settings.bands.maxDelayMs);
    };

    const updateBand = (time: number) => {
      if (time < nextBandTime) return;
      if (bandEndTime && time >= bandEndTime) {
        scheduleBand(time);
        return;
      }
      if (!bandEndTime) {
        // Each brief signal tear appears in a new place instead of sweeping.
        band.style.top = `${randomBetween(12, 72)}%`;
        band.style.height = `${randomBetween(1.5, 4.5)}%`;
        bandEndTime =
          time +
          randomBetween(
            settings.bands.minDurationMs,
            settings.bands.maxDurationMs,
          );
      }
      band.style.opacity = String(
        settings.bands.opacity * intensity * randomBetween(0.5, 1),
      );
      band.style.transform = `translateX(${randomBetween(-6, 6)}px)`;
    };

    const drawNoise = () => {
      if (!frame) return;
      for (let pixel = 0; pixel < frame.data.length; pixel += 4) {
        const brightness = Math.random() * 255;
        frame.data[pixel] = brightness;
        frame.data[pixel + 1] = brightness;
        frame.data[pixel + 2] = brightness;
        frame.data[pixel + 3] = 255;
      }
      context.putImageData(frame, 0, 0);
    };

    const resize = () => {
      const { width, height } = background.getBoundingClientRect();
      if (!width || !height) return;
      const scale = Math.min(
        1,
        settings.noiseMaxWidth / width,
        settings.noiseMaxHeight / height,
      );
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      frame = context.createImageData(canvas.width, canvas.height);
      drawNoise();
    };
    resize();

    const animateNoise = (time: number) => {
      if (time - lastFrameTime >= 1000 / settings.noiseFps) {
        drawNoise();
        updateBand(time);
        lastFrameTime = time;
      }
      animationFrame = requestAnimationFrame(animateNoise);
    };

    const stop = () => {
      glitch?.stopGlitch();
      cancelAnimationFrame(animationFrame);
      band.style.opacity = '0';
      background.dataset.active = 'false';
      running = false;
    };

    const reset = () => {
      stop();
      delete layers.dataset.glitched;
      glitch = undefined;
    };

    const syncPlayback = () => {
      if (reducedMotion.matches || !enabled || intensity === 0) {
        reset();
        return;
      }
      if (!visible || document.visibilityState !== 'visible') {
        stop();
        return;
      }
      if (running) return;

      glitch ??= PowerGlitch.glitch(layers, {
        createContainers: false,
        playMode: 'manual',
        timing: { duration: settings.trackingCycleMs, iterations: Infinity },
        glitchTimeSpan: { start: 0.45, end: 0.6 },
        // Small tracking drift across the whole picture, without digital slices.
        shake: {
          velocity: 8,
          amplitudeX: 0.001 * intensity,
          amplitudeY: 0.002 * intensity,
        },
        pulse: false,
        slice: { count: 0 },
      });
      glitch.startGlitch();
      lastFrameTime = 0;
      scheduleBand(performance.now());
      animationFrame = requestAnimationFrame(animateNoise);
      background.dataset.active = 'true';
      running = true;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(background);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(background);
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      reset();
    };
  }, [enabled, intensity]);

  return (
    <div
      ref={backgroundRef}
      className={styles.background}
      data-hero-background
      data-powered={enabled}
      style={
        {
          '--crt-noise-opacity': settings.noiseOpacity * intensity,
          '--crt-scanline-opacity': settings.scanlineOpacity,
        } as CSSProperties
      }
    >
      <div ref={layersRef} className={styles.layers}>
        <div className={styles.screen}>
          <canvas ref={noiseRef} className={styles.noise} aria-hidden="true" />
          <div className={styles.content}>{children}</div>
          <div className={styles.scanlines} aria-hidden="true" />
          <div
            ref={bandRef}
            className={styles.band}
            data-crt-band
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBackground;
