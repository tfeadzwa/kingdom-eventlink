// src/hooks/useOutsideClick.js
import { useEffect } from "react";

export function useOutsideClick(refs, callback, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleClick = (event) => {
      const isInside = refs.some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!isInside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, callback, active]);
}
