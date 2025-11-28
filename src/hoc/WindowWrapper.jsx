import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "@store/window";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();

    if (!windows || !windows[windowKey]) {
      console.warn(`WindowWrapper: Window "${windowKey}" does not exist`);
      return null;
    }

    const { isOpen, zIndex } = windows[windowKey];
    const ref = useRef(null);
    const draggableRef = useRef(null);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }
      );
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) {
        // Clean up draggable when window is closed
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
        return;
      }

      // Kill any existing draggable before creating a new one
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }

      // Initialize draggable
      draggableRef.current = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      })[0];

      return () => {
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
      };
    }, [isOpen, windowKey, focusWindow]);

    if (!isOpen) {
      return null;
    }

    return (
      <section
        ref={ref}
        style={{
          zIndex,
        }}
        className="absolute"
      >
        <Component {...props} />
      </section>
    );
  };
  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;
  return Wrapped;
};

export default WindowWrapper;
