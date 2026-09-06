"use client";

import { useEffect, useState } from "react";

/**
 * Two overlapping native range inputs (a well-established pattern for a
 * dual-thumb slider without a drag-gesture library) plus a matching pair of
 * number inputs for direct entry, matching the design reference's price
 * filter. Commits on change with a short debounce so dragging doesn't fire
 * a navigation per pixel.
 */
export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onCommit,
  fromLabel,
  toLabel,
}: {
  min: number;
  max: number;
  valueMin?: number;
  valueMax?: number;
  onCommit: (min: number | undefined, max: number | undefined) => void;
  fromLabel: string;
  toLabel: string;
}) {
  const [localMin, setLocalMin] = useState(valueMin ?? min);
  const [localMax, setLocalMax] = useState(valueMax ?? max);

  useEffect(() => {
    setLocalMin(valueMin ?? min);
    setLocalMax(valueMax ?? max);
  }, [valueMin, valueMax, min, max]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const nextMin = localMin <= min ? undefined : localMin;
      const nextMax = localMax >= max ? undefined : localMax;
      if (nextMin !== (valueMin ?? undefined) || nextMax !== (valueMax ?? undefined)) {
        onCommit(nextMin, nextMax);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localMin, localMax]);

  const pctMin = max > min ? ((localMin - min) / (max - min)) * 100 : 0;
  const pctMax = max > min ? ((localMax - min) / (max - min)) * 100 : 100;

  return (
    <div>
      <div className="relative mx-1 mb-4 h-1 rounded-full bg-border">
        <div
          className="absolute top-0 h-1 rounded-full bg-primary"
          style={{ insetInlineStart: `${pctMin}%`, insetInlineEnd: `${100 - pctMax}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax))}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
          aria-label={fromLabel}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin))}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
          aria-label={toLabel}
        />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <input
          type="number"
          value={localMin}
          min={min}
          max={localMax}
          onChange={(e) => setLocalMin(Math.min(Number(e.target.value) || min, localMax))}
          aria-label={fromLabel}
          className="h-[38px] rounded-lg border border-border bg-card px-3 text-[13.5px] text-muted-foreground"
        />
        <input
          type="number"
          value={localMax}
          min={localMin}
          max={max}
          onChange={(e) => setLocalMax(Math.max(Number(e.target.value) || max, localMin))}
          aria-label={toLabel}
          className="h-[38px] rounded-lg border border-border bg-card px-3 text-[13.5px] text-muted-foreground"
        />
      </div>
    </div>
  );
}
