import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isOpen: boolean;
  onClose: () => void;
  focusableSelector?: string;
}

export function useFocusTrap<T extends HTMLElement>({
  isOpen,
  onClose,
  focusableSelector = 'a[tabindex="0"], button[tabindex="0"]',
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const containerElements =
        containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector);

      const allFocusable: HTMLElement[] = [];
      if (triggerRef.current) allFocusable.push(triggerRef.current);
      if (containerElements) allFocusable.push(...containerElements);
      if (!allFocusable.length) return;

      const first = allFocusable[0];
      const last = allFocusable[allFocusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, focusableSelector],
  );

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      const firstEl =
        containerRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstEl?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown, focusableSelector]);

  return { containerRef, triggerRef };
}
