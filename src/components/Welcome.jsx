import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const rendertext = (text, className, baseWeight = 400) => {
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
  if (!container) return;

  const letters = container.querySelectorAll("span");

  const { min, max, default: base } = FONT_WEIGHTS[type];
  const animateLetter = (letter, weight, duration = 0.1) => {
    return gsap.to(letter, {
      fontVariationSettings: `'wght' ${weight}`,
      duration: duration,
      ease: "power2.inOut",
    });
  };

  const handleMouseMove = (e) => {
    const containerRect = container.getBoundingClientRect();
    const x = e.clientX - containerRect.left;

    letters.forEach((letter) => {
      const letterRect = letter.getBoundingClientRect();
      const letterCenter =
        letterRect.left - containerRect.left + letterRect.width / 2;
      const distance = Math.abs(x - letterCenter);
      const intensity = Math.exp(-(distance ** 2) / 5000);

      animateLetter(letter, min + (max - min) * intensity);
    });
  };
  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetter(letter, base, 0.3);
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      if (titleCleanup) titleCleanup();
      if (subtitleCleanup) subtitleCleanup();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {rendertext(
          "Hello, I'm Tom. Welcome to my",
          "text-3xl font-georama",
          "100"
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {rendertext("Portfolio", "text-9xl italic font-georama")}
      </h1>

      <div className="small-screen">
        <p>This website is best viewed on a tablet or desktop</p>
      </div>
    </section>
  );
};

export default Welcome;
