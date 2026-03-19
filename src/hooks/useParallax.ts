import { useRef, useEffect } from 'react';

interface ParallaxLayer {
  ref: { readonly current: HTMLElement | null };
  speed: number;
  scale?: [number, number];
  fadeOut?: boolean;
}

export default function useParallax(layers: ParallaxLayer[]) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef({ progress: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applyTransforms = () => {
      const { progress } = scrollRef.current;

      for (const layer of layers) {
        const el = layer.ref.current;
        if (!el) continue;

        const translateY = progress * layer.speed;
        const scaleStart = layer.scale?.[0] ?? 1;
        const scaleEnd = layer.scale?.[1] ?? 1;
        const scale = scaleStart + (scaleEnd - scaleStart) * progress;

        el.style.transform = `translateY(${translateY}px) scale(${scale})`;

        if (layer.fadeOut) {
          el.style.opacity = `${Math.max(0, 1 - progress * 1.2)}`;
        }
      }
    };

    let scrollTicking = false;
    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrolled = -rect.top;
        scrollRef.current.progress = Math.max(
          0,
          Math.min(scrolled / rect.height, 1),
        );
        applyTransforms();
        scrollTicking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [layers]);

  return containerRef;
}
