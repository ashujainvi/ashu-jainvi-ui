import { useEffect, useRef, useCallback, type RefObject } from 'react';

const DESKTOP_MQ = '(pointer: fine)';

/**
 * Tracks the mouse position over an element and writes:
 *   --spotlight-x / --spotlight-y  (px from top-left)
 *   --spotlight-active             (0 | 1)
 *   --parallax-x / --parallax-y    (normalised –1 → 1)
 *   --tilt-x / --tilt-y            (degrees, ±12)
 *
 * The spotlight flows in from the nearest edge on entry and fades
 * out smoothly on leave, creating a seamless transition between cards.
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
  const tiltFactor = useRef(0);
  const targetTiltFactor = useRef(0);
  const active = useRef(false);
  const rafId = useRef(0);

  const tick = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    currentX.current += (targetX.current - currentX.current) * lerpFactor;
    currentY.current += (targetY.current - currentY.current) * lerpFactor;
    tiltFactor.current += (targetTiltFactor.current - tiltFactor.current) * lerpFactor;

    const w = el.offsetWidth || 1;
    const h = el.offsetHeight || 1;

    // Normalised –1 → 1 (centre = 0)
    const nx = (currentX.current / w) * 2 - 1;
    const ny = (currentY.current / h) * 2 - 1;

    const tf = tiltFactor.current;

    el.style.setProperty('--spotlight-x', `${currentX.current}px`);
    el.style.setProperty('--spotlight-y', `${currentY.current}px`);
    el.style.setProperty('--parallax-x', `${nx * tf}`);
    el.style.setProperty('--parallax-y', `${ny * tf}`);
    el.style.setProperty('--tilt-x', `${-ny * tiltMax * tf}`);
    el.style.setProperty('--tilt-y', `${nx * tiltMax * tf}`);

    const needsUpdate =
      active.current ||
      Math.abs(targetX.current - currentX.current) > 0.1 ||
      Math.abs(targetY.current - currentY.current) > 0.1 ||
      Math.abs(targetTiltFactor.current - tiltFactor.current) > 0.01;

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
        // Start spotlight from nearest edge for a seamless flow-in
        const x = targetX.current;
        const y = targetY.current;
        const w = rect.width;
        const h = rect.height;

        const edges = [
          { dist: x, cx: 0, cy: y },
          { dist: w - x, cx: w, cy: y },
          { dist: y, cx: x, cy: 0 },
          { dist: h - y, cx: x, cy: h },
        ];
        const nearest = edges.reduce((a, b) => (a.dist < b.dist ? a : b));

        currentX.current = nearest.cx;
        currentY.current = nearest.cy;
        tiltFactor.current = 0;
        targetTiltFactor.current = 1;

        active.current = true;
        el.style.setProperty('--spotlight-active', '1');
        rafId.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      active.current = false;
      el.style.setProperty('--spotlight-active', '0');
      // Tilt eases back to zero; spotlight position stays and fades via CSS
      targetTiltFactor.current = 0;
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
