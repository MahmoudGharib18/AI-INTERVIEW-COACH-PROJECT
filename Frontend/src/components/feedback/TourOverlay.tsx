import { Button } from '@/components/ui/Button.tsx';
import { TOUR_STEPS, useTour } from '@/context/TourContext.tsx';
import React, { useEffect, useState, useRef } from 'react';


const VIEWPORT_MARGIN = 16;
const GAP = 20;

export const TourOverlay: React.FC = () => {
  const { isActive, currentStep, currentStepIndex, next, prev, endTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const retryRef = useRef<number>(0);

  // step 1: locate the target element on screen
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetRect(null);
      setTargetMissing(false);
      return;
    }

    retryRef.current = 0;
    setTargetMissing(false);

    const measure = () => {
      const el = document.querySelector(`[data-tour-id="${currentStep.targetSelector}"]`);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (retryRef.current < 10) {
        retryRef.current += 1;
        setTimeout(measure, 150);
      } else {
        // genuinely not on screen in this app state — don't fail silently,
        // show the step as a centered message instead of a spotlight
        setTargetRect(null);
        setTargetMissing(true);
      }
    };

    measure();

    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, currentStep]);

  // step 2: once we know the target AND have measured the card's real size,
  // compute a position that stays adjacent and on-screen, flipping sides if needed
  useEffect(() => {
    if (!targetRect || !cardRef.current) {
      setCardPos(null);
      return;
    }

    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width || 320;
    const cardHeight = cardRect.height || 205;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const placement = currentStep?.placement || 'bottom';

    const fits = {
      right: targetRect.right + GAP + cardWidth <= vw - VIEWPORT_MARGIN,
      left: targetRect.left - GAP - cardWidth >= VIEWPORT_MARGIN,
      bottom: targetRect.bottom + GAP + cardHeight <= vh - VIEWPORT_MARGIN,
      top: targetRect.top - GAP - cardHeight >= VIEWPORT_MARGIN,
    };

    // try the requested placement first; if it doesn't fit, fall back to whichever does
    const order = [placement, 'bottom', 'right', 'left', 'top'] as const;
    const chosen = order.find((p) => fits[p as keyof typeof fits]) || 'bottom';

    let top: number;
    let left: number;

    switch (chosen) {
      case 'right':
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.right + GAP;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.left - GAP - cardWidth;
        break;
      case 'top':
        top = targetRect.top - GAP - cardHeight;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        break;
      default:
        top = targetRect.bottom + GAP;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    }

    top = Math.min(Math.max(top, VIEWPORT_MARGIN), vh - cardHeight - VIEWPORT_MARGIN);
    left = Math.min(Math.max(left, VIEWPORT_MARGIN), vw - cardWidth - VIEWPORT_MARGIN);

    setCardPos({ top, left });
  }, [targetRect, currentStep]);

  if (!isActive || !currentStep) return null;

  const padding = 8;
  const boxTop = targetRect ? targetRect.top - padding : 0;
  const boxLeft = targetRect ? targetRect.left - padding : 0;
  const boxWidth = targetRect ? targetRect.width + padding * 2 : 0;
  const boxHeight = targetRect ? targetRect.height + padding * 2 : 0;

  const isLast = currentStepIndex === TOUR_STEPS.length - 1;
  const isFirst = currentStepIndex === 0;

  // connecting line from the card's nearest edge to the target's center
  const renderConnector = () => {
    if (!targetRect || !cardPos || !cardRef.current) return null;
    const cardRect = cardRef.current.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const cardCenterX = cardPos.left + cardRect.width / 2;
    const cardCenterY = cardPos.top + cardRect.height / 2;

    return (
      <svg className="fixed inset-0 pointer-events-none z-[101]" width="100%" height="100%">
        <line
          x1={cardCenterX}
          y1={cardCenterY}
          x2={targetCenterX}
          y2={targetCenterY}
          stroke="#00ff66"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.7}
        />
        <circle cx={targetCenterX} cy={targetCenterY} r={5} fill="#00ff66" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] font-mono">
      {targetRect && (
        <div
          className="absolute transition-all duration-300 rounded-sm pointer-events-none z-[100]"
          style={{
            top: boxTop,
            left: boxLeft,
            width: boxWidth,
            height: boxHeight,
            boxShadow: '0 0 0 9999px rgba(10, 10, 12, 0.85)',
            border: '2px solid #00ff66',
          }}
        />
      )}

      {!targetRect && (
        <div className="absolute inset-0 bg-[#0a0a0c]/90" />
      )}

      {targetRect && renderConnector()}

      <div
        ref={cardRef}
        className="absolute bg-[#121215] border-2 border-[#00ff66] shadow-brutal p-4 max-w-xs z-[102] transition-all duration-200"
        style={
          cardPos
            ? { top: cardPos.top, left: cardPos.left }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        }
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-[#8a8a93] font-bold tracking-widest uppercase">
            STEP {currentStepIndex + 1} / {TOUR_STEPS.length}
          </span>
          <button
            onClick={endTour}
            className="text-[9px] text-[#8a8a93] hover:text-[#ff0033] uppercase font-bold tracking-widest"
          >
            [SKIP]
          </button>
        </div>

        <h3 className="text-white font-black uppercase text-sm mb-1">{currentStep.title}</h3>
        <p className="text-xs text-gray-300 leading-relaxed mb-1">{currentStep.body}</p>

        {targetMissing && (
          <p className="text-[10px] text-[#ff5500] mb-3 italic">
            (This element isn't visible right now — it depends on your current session state. Continue and it'll be there next time it applies.)
          </p>
        )}

        <div className="flex space-x-2 mt-3">
          {!isFirst && (
            <Button variant="muted" className="flex-1 py-2 text-[10px]" onClick={prev}>
              PREV
            </Button>
          )}
          <Button variant="neon" className="flex-1 py-2 text-[10px]" onClick={next}>
            {isLast ? 'FINISH' : 'NEXT'}
          </Button>
        </div>
      </div>
    </div>
  );
};