"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
  type TouchEventHandler,
} from "react";

export interface UsePresentationNavigationOptions {
  slideCount: number;
  currentSlide?: number;
  initialSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
  swipeThreshold?: number;
  enabled?: boolean;
}

export interface PresentationSwipeHandlers {
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchMove: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
  onTouchCancel: TouchEventHandler<HTMLElement>;
}

interface TouchOrigin {
  identifier: number;
  x: number;
  y: number;
}

const DEFAULT_SWIPE_THRESHOLD = 48;
const KEYBOARD_BLOCKING_SELECTOR = [
  "input",
  "textarea",
  "select",
  "button",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='textbox']",
  "[role='combobox']",
  "[role='slider']",
  "[role='spinbutton']",
].join(",");
const SWIPE_BLOCKING_SELECTOR = [
  KEYBOARD_BLOCKING_SELECTOR,
  "a",
  "[role='button']",
  "[data-presentation-swipe-ignore]",
].join(",");

function normalizeSlideCount(slideCount: number) {
  if (!Number.isFinite(slideCount)) return 0;
  return Math.max(0, Math.floor(slideCount));
}

function clampSlide(slideIndex: number, slideCount: number) {
  if (slideCount === 0) return 0;
  if (!Number.isFinite(slideIndex)) return 0;
  return Math.min(Math.max(Math.floor(slideIndex), 0), slideCount - 1);
}

function isInside(target: EventTarget | null, selector: string) {
  return target instanceof Element && Boolean(target.closest(selector));
}

function findChangedTouch(event: ReactTouchEvent<HTMLElement>, identifier: number) {
  for (let index = 0; index < event.changedTouches.length; index += 1) {
    const touch = event.changedTouches.item(index);
    if (touch?.identifier === identifier) return touch;
  }

  return null;
}

/**
 * Shared state and input handling for a controlled or uncontrolled slide deck.
 * Spread `swipeHandlers` onto the presentation stage (not the controls).
 */
export function usePresentationNavigation({
  slideCount: requestedSlideCount,
  currentSlide: controlledSlide,
  initialSlide = 0,
  onSlideChange,
  swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
  enabled = true,
}: UsePresentationNavigationOptions) {
  const slideCount = normalizeSlideCount(requestedSlideCount);
  const [uncontrolledSlide, setUncontrolledSlide] = useState(() =>
    clampSlide(initialSlide, slideCount),
  );
  const currentSlide = clampSlide(controlledSlide ?? uncontrolledSlide, slideCount);
  const touchOrigin = useRef<TouchOrigin | null>(null);

  const goTo = useCallback(
    (slideIndex: number) => {
      if (!enabled || slideCount === 0) return;

      const nextSlide = clampSlide(slideIndex, slideCount);
      if (nextSlide === currentSlide) return;

      if (controlledSlide === undefined) {
        setUncontrolledSlide(nextSlide);
      }
      onSlideChange?.(nextSlide);
    },
    [controlledSlide, currentSlide, enabled, onSlideChange, slideCount],
  );

  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);
  const previous = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);

  useEffect(() => {
    if (!enabled || slideCount === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInside(event.target, KEYBOARD_BLOCKING_SELECTOR)
      ) {
        return;
      }

      let destination: number | null = null;

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          destination = currentSlide + 1;
          break;
        case "ArrowLeft":
        case "PageUp":
          destination = currentSlide - 1;
          break;
        case "Home":
          destination = 0;
          break;
        case "End":
          destination = slideCount - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      goTo(destination);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, enabled, goTo, slideCount]);

  const onTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLElement>) => {
      touchOrigin.current = null;
      if (!enabled || event.touches.length !== 1 || isInside(event.target, SWIPE_BLOCKING_SELECTOR)) {
        return;
      }

      const touch = event.touches.item(0);
      if (!touch) return;

      touchOrigin.current = {
        identifier: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
      };
    },
    [enabled],
  );

  const onTouchMove = useCallback((event: ReactTouchEvent<HTMLElement>) => {
    const origin = touchOrigin.current;
    if (!origin) return;

    let activeX: number | null = null;
    let activeY: number | null = null;
    for (let index = 0; index < event.touches.length; index += 1) {
      const touch = event.touches.item(index);
      if (touch?.identifier === origin.identifier) {
        activeX = touch.clientX;
        activeY = touch.clientY;
        break;
      }
    }

    if (activeX === null || activeY === null || Math.abs(activeY - origin.y) > Math.abs(activeX - origin.x)) {
      touchOrigin.current = null;
    }
  }, []);

  const onTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLElement>) => {
      const origin = touchOrigin.current;
      touchOrigin.current = null;
      if (!origin || !enabled) return;

      const touch = findChangedTouch(event, origin.identifier);
      if (!touch) return;

      const deltaX = touch.clientX - origin.x;
      const deltaY = touch.clientY - origin.y;
      const minimumDistance = Math.max(24, swipeThreshold);

      if (Math.abs(deltaX) < minimumDistance || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) {
        return;
      }

      if (deltaX < 0) next();
      else previous();
    },
    [enabled, next, previous, swipeThreshold],
  );

  const onTouchCancel = useCallback(() => {
    touchOrigin.current = null;
  }, []);

  const swipeHandlers: PresentationSwipeHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };

  return {
    currentSlide,
    slideCount,
    canGoPrevious: enabled && currentSlide > 0,
    canGoNext: enabled && currentSlide < slideCount - 1,
    goTo,
    next,
    previous,
    swipeHandlers,
  };
}

export default usePresentationNavigation;
