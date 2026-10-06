"use client";

import { useEffect, useState, type RefObject } from "react";

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return reduce;
}

/** Sets data-paused on the element while it is off-screen, so CSS/SMIL ambient motion stops. */
export function usePauseOffscreen(ref: RefObject<Element | null>, onChange?: (visible: boolean) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) el.removeAttribute("data-paused");
        else el.setAttribute("data-paused", "");
        el.querySelectorAll("svg").forEach((svg) => {
          if (visible) svg.unpauseAnimations?.();
          else svg.pauseAnimations?.();
        });
        onChange?.(visible);
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, onChange]);
}

export function useMediaQuery(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const set = () => setM(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [q]);
  return m;
}
