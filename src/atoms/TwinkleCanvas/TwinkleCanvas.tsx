import { useRef, useEffect, useCallback, type FC } from 'react';
import styles from './TwinkleCanvas.module.css';

interface Light {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  life: number;
  maxLife: number;
}

interface TwinkleCanvasProps {
  count?: number;
  /** Vertical fraction of the canvas where lights appear (0–1) */
  regionHeight?: number;
  /** Min radius of each light */
  minRadius?: number;
  /** Max radius of each light */
  maxRadius?: number;
  /** Min opacity */
  minOpacity?: number;
  /** Max opacity */
  maxOpacity?: number;
  /** RGB color for the lights */
  color?: [number, number, number];
  /** Enable shooting star effect */
  shootingStars?: boolean;
  /** Min interval between shooting stars in ms */
  shootingStarMinInterval?: number;
  /** Max interval between shooting stars in ms */
  shootingStarMaxInterval?: number;
  className?: string;
}

const getPerformanceTier = (): 'low' | 'mid' | 'high' => {
  const cores = navigator.hardwareConcurrency ?? 2;
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile && cores <= 4) return 'low';
  if (isMobile || cores <= 4) return 'mid';
  return 'high';
};

const TwinkleCanvas: FC<TwinkleCanvasProps> = ({
  count = 25,
  regionHeight = 0.5,
  minRadius = 0.4,
  maxRadius = 1,
  minOpacity = 0.15,
  maxOpacity = 0.45,
  color = [180, 180, 180],
  shootingStars = true,
  shootingStarMinInterval = 600,
  shootingStarMaxInterval = 10000,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightsRef = useRef<Light[]>([]);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  const nextShootingStarTime = useRef(0);

  const initLights = useCallback((width: number, height: number) => {
    lightsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * regionHeight),
      radius: minRadius + Math.random() * (maxRadius - minRadius),
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
    }));
  }, [count, regionHeight, minRadius, maxRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tier = getPerformanceTier();
    const dpr = tier === 'low' ? 1 : Math.min(window.devicePixelRatio ?? 1, 2);
    const frameInterval = tier === 'low' ? 1000 / 30 : 0; // cap at 30fps on low-end
    let lastFrameTime = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (lightsRef.current.length === 0) initLights(width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    const opacityRange = maxOpacity - minOpacity;
    const [r, g, b] = color;
    const effectiveCount = tier === 'low' ? Math.ceil(count * 0.6) : count;
    const enableShootingStars = shootingStars && tier !== 'low';

    // Re-init lights if tier reduced the count
    if (lightsRef.current.length > effectiveCount) {
      lightsRef.current = lightsRef.current.slice(0, effectiveCount);
    }

    const spawnShootingStar = (w: number, h: number): ShootingStar => {
      const upperH = h * regionHeight;
      const startX = Math.random() * w * 0.8;
      const startY = Math.random() * upperH * 0.4;
      const angle = Math.PI * (0.1 + Math.random() * 0.15);
      const speed = 2.55 + Math.random() * 3.4;
      return {
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: 40 + Math.random() * 60,
        speed,
        life: 0,
        maxLife: 30 + Math.random() * 30,
      };
    };

    const scheduleNext = (time: number) => {
      nextShootingStarTime.current = time + shootingStarMinInterval +
        Math.random() * (shootingStarMaxInterval - shootingStarMinInterval);
    };

    let raf: number;
    const animate = (time: number) => {
      if (frameInterval > 0 && time - lastFrameTime < frameInterval) {
        raf = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time;

      const logicalW = canvas.width / dpr;
      const logicalH = canvas.height / dpr;
      ctx.clearRect(0, 0, logicalW, logicalH);

      // Twinkling lights
      for (const light of lightsRef.current) {
        const opacity = minOpacity + opacityRange * ((Math.sin(time * 0.001 * light.speed + light.phase) + 1) / 2);
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }

      // Shooting star
      if (enableShootingStars) {
        if (nextShootingStarTime.current === 0) {
          scheduleNext(time);
        }

        if (!shootingStarRef.current && time >= nextShootingStarTime.current) {
          shootingStarRef.current = spawnShootingStar(canvas.width / dpr, canvas.height / dpr);
        }

        const star = shootingStarRef.current;
        if (star) {
          star.x += star.dx;
          star.y += star.dy;
          star.life++;

          const progress = star.life / star.maxLife;
          const fadeIn = Math.min(progress * 4, 1);
          const fadeOut = Math.max(0, 1 - (progress - 0.6) / 0.4);
          const alpha = Math.min(fadeIn, fadeOut) * 0.7;

          const tailX = star.x - star.dx * (star.length / star.speed);
          const tailY = star.y - star.dy * (star.length / star.speed);

          const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Bright head
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          if (star.life >= star.maxLife) {
            shootingStarRef.current = null;
            scheduleNext(time);
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [initLights, minOpacity, maxOpacity, color, shootingStars, shootingStarMinInterval, shootingStarMaxInterval, regionHeight]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.twinkleCanvas} ${className}`.trim()}
      aria-hidden="true"
    />
  );
};

export default TwinkleCanvas;
