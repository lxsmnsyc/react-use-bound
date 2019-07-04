import { useState, useEffect, useRef, MutableRefObject } from 'react';
import boundsJs from 'bounds.js';

type BoundRoot = HTMLElement | Window | Document;

type BoundMargins = {
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
};

type BoundOnEmitAction = {
  el: HTMLElement,
  inside: boolean,
  outside: boolean,
  ratio: number,
};

type BoundOnEmit = (BoundOnEmitAction?) => void;

type BoundOptions = {
  root?: BoundRoot,
  margins?: BoundMargins,
  threshold?: number,
  onEmit?: BoundOnEmit,
};

type BoundReference = MutableRefObject<HTMLElement> | HTMLElement;

const isMutableRefObject = (ref: BoundReference): ref is MutableRefObject<HTMLElement> =>
  (ref as MutableRefObject<HTMLElement>).current !== undefined;

/**
 * Provides a React Hook as a bound.
 * @param ref { BoundReference }
 * @param options
 * @returns [number, number]
 */
const useBound = (ref: BoundReference, options?: BoundOptions): [number, number] => {
  const [enterRatio, setEnterRatio] = useState(0);
  const [leaveRatio, setLeaveRatio] = useState(0);

  useEffect(
    () => {
      const boundary = boundsJs(options);
      if (isMutableRefObject(ref)) {
        if (ref.current instanceof HTMLElement) {
          boundary.watch(ref.current, setEnterRatio, setLeaveRatio);

          return () => {
            boundary.unWatch();
          };
        }
      }
      if (ref instanceof HTMLElement) {
        boundary.watch(ref, setEnterRatio, setLeaveRatio);

        return () => {
          boundary.unWatch();
        };
      }
    },
    [ref, options],
  );

  return [enterRatio, leaveRatio];
};

export default useBound;
