import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "@constants/index";

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        if (!windowKey) {
          console.warn("openWindow: windowKey is required");
          return;
        }
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`openWindow: Window "${windowKey}" does not exist`);
          return;
        }
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        if (!windowKey) {
          console.warn("closeWindow: windowKey is required");
          return;
        }
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`closeWindow: Window "${windowKey}" does not exist`);
          return;
        }
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
        win.isMaximized = false;
        win.previousBounds = null;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        if (!windowKey) {
          console.warn("focusWindow: windowKey is required");
          return;
        }
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`focusWindow: Window "${windowKey}" does not exist`);
          return;
        }
        win.zIndex = state.nextZIndex++;
      }),

    maximizeWindow: (windowKey, bounds = null) =>
      set((state) => {
        if (!windowKey) {
          console.warn("maximizeWindow: windowKey is required");
          return;
        }
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`maximizeWindow: Window "${windowKey}" does not exist`);
          return;
        }
        if (!win.isMaximized) {
          // Store previous bounds if provided
          if (bounds) {
            win.previousBounds = bounds;
          }
          win.isMaximized = true;
        }
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        if (!windowKey) {
          console.warn("minimizeWindow: windowKey is required");
          return;
        }
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`minimizeWindow: Window "${windowKey}" does not exist`);
          return;
        }
        if (win.isMaximized) {
          win.isMaximized = false;
        }
      }),
  }))
);

export default useWindowStore;
