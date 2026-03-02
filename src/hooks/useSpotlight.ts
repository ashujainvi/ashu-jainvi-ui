import { useEffect, useRef, useCallback, type RefObject } from 'react';

const DESKTOP_MQ = '(pointer: fine)';

/**
 * Tracks the mouse position over an element and writes:
 *   --spotlight-x / --spotlight-y  (px from top-left)
 *   --spotlight-active             (0 | 1)
 *   --parallax-x / --parallax-y    (normalised –1 → 1)
 *   --tilt-x / --tilt-y            (degrees, ±12)
 *
 * Uses a lerp loop for buttery-smooth movement.
 * Desktop-only — no-ops on touch devices.
 */
export default function useSpotlight<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { lerpFactor = 0.1, tiltMax = 12 }: { lerpFactor?: number; tiltMax?: number } = {},
) {
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const active = useRef(false);
  const rafId = useRef(0);

  const tick = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    currentX.current += (targetX.current - currentX.current) * lerpFactor;
    currentY.current += (targetY.current - currentY.current) * lerpFactor;

    const w = el.offsetWidth || 1;
    const h = el.offsetHeight || 1;

    // Normalised –1 → 1 (centre = 0)
    const nx = (currentX.current / w) * 2 - 1;
    const ny = (currentY.current / h) * 2 - 1;

    // Angle from centre in degrees (0 = right, rotates clockwise)
    const angle = Math.atan2(ny, nx) * (180 / Math.PI);

    el.style.setProperty('--spotlight-x', `${currentX.current}px`);
    el.style.setProperty('--spotlight-y', `${currentY.current}px`);
    el.style.setProperty('--spotlight-angle', `${angle}deg`);
    el.style.setProperty('--parallax-x', `${nx}`);
    el.style.setProperty('--parallax-y', `${ny}`);
    el.style.setProperty('--tilt-x', `${-ny * tiltMax}`);
    el.style.setProperty('--tilt-y', `${nx * tiltMax}`);

    const needsUpdate =
      active.current ||
      Math.abs(targetX.current - currentX.current) > 0.1 ||
      Math.abs(targetY.current - currentY.current) > 0.1;

    if (needsUpdate) {
      rafId.current = requestAnimationFrame(tick);
    }
  }, [ref, lerpFactor, tiltMax]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(DESKTOP_MQ).matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX.current = e.clientX - rect.left;
      targetY.current = e.clientY - rect.top;

      if (!active.current) {
        currentX.current = targetX.current;
        currentY.current = targetY.current;
        active.current = true;
        el.style.setProperty('--spotlight-active', '1');
        rafId.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      active.current = false;
      el.style.setProperty('--spotlight-active', '0');
      // Ease tilt + parallax back to 0
      targetX.current = el.offsetWidth / 2;
      targetY.current = el.offsetHeight / 2;
      rafId.current = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [ref, tick]);
}
