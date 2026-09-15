"use client";

import { useEffect, useState, useRef } from "react";

const SCROLL_THRESHOLD = 8;

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // لو الشاشة أكبر من 1025px → الهيدر يفضل ظاهر
    if (window.innerWidth > 1025) {
      setIsVisible(true);
      return;
    }

    lastScrollY.current = window.scrollY;

    function onScroll() {
      // لو المستخدم كبّر الشاشة أثناء التشغيل
      if (window.innerWidth > 1025) {
        setIsVisible(true);
        return;
      }

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY.current;

          if (currentScrollY < 10) {
            setIsVisible(true);
          } else if (Math.abs(diff) > SCROLL_THRESHOLD) {
            // scroll up → show
            // scroll down → hide
            setIsVisible(diff < 0);
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return isVisible;
}
