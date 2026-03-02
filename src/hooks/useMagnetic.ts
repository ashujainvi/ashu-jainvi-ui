import { useLayoutEffect, useId } from 'react';
import StringTune, { StringMagnetic } from '@fiddle-digital/string-tune';

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

const DESKTOP_MQ = '(pointer: fine)';

let engineStarted = false;

function ensureEngine() {
  if (engineStarted) return;
  engineStarted = true;

  const st = StringTune.getInstance();
  st.use(StringMagnetic);
  st.start(60);
}

/**
 * Wraps the String Tune `StringMagnetic` module as a React hook.
 * Desktop-only — returns empty props on touch devices.
 *
 * Spread the returned object onto the target element so the attributes
 * are present when the node enters the DOM (required for the library's
 * MutationObserver to pick them up).
 */
export default function useMagnetic(
  { strength = 0.3, radius = 150 }: MagneticOptions = {},
): Record<string, string> {
  const id = useId();

  // Synchronous check — fine for a Vite SPA (no SSR).
  const isDesktop =
    typeof window !== 'undefined' &&
    window.matchMedia(DESKTOP_MQ).matches;

  // Start the engine before the browser paints so initObjects()
  // can discover elements that already carry string="magnetic".
  useLayoutEffect(() => {
    if (isDesktop) ensureEngine();
  }, [isDesktop]);

  if (!isDesktop) return {};

  return {
    string: 'magnetic',
    'string-id': id,
    'string-strength': String(strength),
    'string-radius': String(radius),
  };
}
