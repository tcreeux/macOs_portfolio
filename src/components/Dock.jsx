import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "@constants/index";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "@store/window";

const Dock = () => {
  const docRef = useRef(null);
  const { openWindow, closeWindow, focusWindow, windows } = useWindowStore();

  useGSAP(() => {
    const dock = docRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcons = (mouseX) => {
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -20 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const handleMouseLeave = () => {
      resetIcons();
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const toggleApp = (app) => {
    if (!app || !app.id) {
      console.warn("toggleApp: Invalid app object");
      return;
    }

    if (!app.canOpen) return;

    const window = windows?.[app.id];
    if (!window) {
      console.warn(
        `toggleApp: Window "${app.id}" does not exist in windows store`
      );
      return;
    }

    if (window.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }
  };

  if (!openWindow || !closeWindow || !windows) {
    console.error("Dock: Window store functions are not available");
    return null;
  }

  if (!dockApps || !Array.isArray(dockApps) || dockApps.length === 0) {
    return null;
  }

  return (
    <section id="dock">
      <div ref={docRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => {
          if (!id || !name || !icon) {
            console.warn("Dock: Invalid app configuration", { id, name, icon });
            return null;
          }
          return (
            <div key={id} className="relative flex justify-center">
              <button
                type="button"
                className="dock-icon"
                aria-label={name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={name}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={() => toggleApp({ id, canOpen })}
              >
                <img
                  src={`images/${icon}`}
                  alt={name}
                  loading="lazy"
                  className={canOpen ? "" : "opacity-60"}
                />
              </button>
            </div>
          );
        })}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
