import React, { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const ANIMATION_CONFIG = {
  HOVER_DURATION: 0.1,
  MOUSE_LEAVE_DURATION: 0.3,
  INTENSITY_DIVISOR: 5000,
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  if (!FONT_WEIGHTS[type]) {
    console.warn(
      `Invalid type "${type}" for FONT_WEIGHTS. Available types: ${Object.keys(
        FONT_WEIGHTS
      ).join(", ")}`
    );
    return () => {};
  }

  const letters = container.querySelectorAll("span");

  const { min, max, default: base } = FONT_WEIGHTS[type];
  const animateLetter = (
    letter,
    weight,
    duration = ANIMATION_CONFIG.HOVER_DURATION
  ) => {
    return gsap.to(letter, {
      fontVariationSettings: `'wght' ${weight}`,
      duration: duration,
      ease: "power2.inOut",
    });
  };

  let rafId = null;
  let lastMouseX = null;

  const handleMouseMove = (e) => {
    lastMouseX = e.clientX;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const x = lastMouseX - containerRect.left;

        letters.forEach((letter) => {
          const letterRect = letter.getBoundingClientRect();
          const letterCenter =
            letterRect.left - containerRect.left + letterRect.width / 2;
          const distance = Math.abs(x - letterCenter);
          const intensity = Math.exp(
            -(distance ** 2) / ANIMATION_CONFIG.INTENSITY_DIVISOR
          );

          animateLetter(letter, min + (max - min) * intensity);
        });

        rafId = null;
      });
    }
  };
  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetter(letter, base, ANIMATION_CONFIG.MOUSE_LEAVE_DURATION);
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const subtitleText = useMemo(
    () =>
      renderText("Hello, I'm Tom. Welcome to my", "text-3xl font-georama", 100),
    []
  );

  const titleText = useMemo(
    () => renderText("portfolio", "text-9xl italic font-georama"),
    []
  );

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      titleCleanup();
      subtitleCleanup();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>{subtitleText}</p>
      <h1 ref={titleRef} className="mt-7">
        {titleText}
      </h1>

      <div className="small-screen">
        <p>This website is best viewed on a tablet or desktop</p>
      </div>
    </section>
  );
};

export default Welcome;
