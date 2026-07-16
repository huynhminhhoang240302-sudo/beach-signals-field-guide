"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PresentationControlsProps {
  currentSlide: number;
  slideCount: number;
  slideLabels?: readonly string[];
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (slideIndex: number) => void;
  className?: string;
}

function normalizeSlideCount(slideCount: number) {
  if (!Number.isFinite(slideCount)) return 0;
  return Math.max(0, Math.floor(slideCount));
}

function getSlideLabel(slideLabels: readonly string[] | undefined, slideIndex: number) {
  const label = slideLabels?.[slideIndex]?.trim();
  return label || `Slide ${slideIndex + 1}`;
}

export function PresentationControls({
  currentSlide: requestedCurrentSlide,
  slideCount: requestedSlideCount,
  slideLabels,
  onPrevious,
  onNext,
  onGoTo,
  className,
}: PresentationControlsProps) {
  const slideCount = normalizeSlideCount(requestedSlideCount);
  const currentSlide = slideCount === 0
    ? 0
    : Math.min(Math.max(Math.floor(requestedCurrentSlide), 0), slideCount - 1);
  const hasSlides = slideCount > 0;
  const currentLabel = hasSlides ? getSlideLabel(slideLabels, currentSlide) : "No slides available";
  const rootClassName = ["presentation-controls", className].filter(Boolean).join(" ");

  return (
    <nav className={rootClassName} aria-label="Presentation controls">
      <button
        className="presentation-controls__button presentation-controls__button--previous"
        type="button"
        onClick={onPrevious}
        disabled={!hasSlides || currentSlide === 0}
        aria-label="Previous slide"
      >
        <ChevronLeft aria-hidden="true" />
        <span className="presentation-controls__button-label">Previous</span>
      </button>

      <div className="presentation-controls__progress">
        <div className="presentation-controls__status" role="status" aria-live="polite" aria-atomic="true">
          <span className="presentation-controls__counter">
            {hasSlides ? `${currentSlide + 1} / ${slideCount}` : "0 / 0"}
          </span>
          <span className="presentation-controls__title">{currentLabel}</span>
        </div>

        {hasSlides ? (
          <div className="presentation-controls__dots" aria-label="Choose a slide">
            {Array.from({ length: slideCount }, (_, slideIndex) => {
              const label = getSlideLabel(slideLabels, slideIndex);
              const isCurrent = slideIndex === currentSlide;

              return (
                <button
                  className={`presentation-controls__dot-button${isCurrent ? " is-active" : ""}`}
                  type="button"
                  key={`${slideIndex}-${label}`}
                  onClick={() => onGoTo(slideIndex)}
                  disabled={isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${isCurrent ? "Current slide" : "Go to slide"} ${slideIndex + 1}: ${label}`}
                  title={label}
                >
                  <span className="presentation-controls__dot" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <button
        className="presentation-controls__button presentation-controls__button--next"
        type="button"
        onClick={onNext}
        disabled={!hasSlides || currentSlide === slideCount - 1}
        aria-label="Next slide"
      >
        <span className="presentation-controls__button-label">Next</span>
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}

export default PresentationControls;
