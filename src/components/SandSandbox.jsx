import React, { useEffect, useRef, useState } from "react";
import { SandEngine } from "../simulation/SandEngine";
import SandControls from "./SandControls";

export default function SandSandbox() {
  const canvasRef = useRef(null);
  const [activeElement, setActiveElement] = useState(1);
  const [eraserSize, setEraserSize] = useState(4);
  const engineRef = useRef(null);
  const inputRef = useRef({ isDrawing: false, lastX: null, lastY: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const engine = new SandEngine(200, 150, 4);
    engineRef.current = engine;

    let animationFrameId;

    const renderLoop = () => {
      engine.updatePhysics();
      engine.drawGrid(ctx);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const getGridCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.floor(
      ((clientX - rect.left) / rect.width) * engineRef.current.width,
    );
    const y = Math.floor(
      ((clientY - rect.top) / rect.height) * engineRef.current.height,
    );
    return { x, y };
  };

  const drawLine = (x0, y0, x1, y1, element, radius) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (element === 0) {
        for (let row = -radius; row <= radius; row++) {
          for (let col = -radius; col <= radius; col++) {
            if (col * col + row * row <= radius * radius) {
              engineRef.current.setCell(x0 + col, y0 + row, 0);
            }
          }
        }
      } else {
        engineRef.current.setCell(x0, y0, element);
      }

      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  const handleStart = (e) => {
    inputRef.current.isDrawing = true;
    const { x, y } = getGridCoords(e);
    inputRef.current.lastX = x;
    inputRef.current.lastY = y;
    drawLine(x, y, x, y, activeElement, eraserSize);
  };

  const handleMove = (e) => {
    if (!inputRef.current.isDrawing) return;
    const { x, y } = getGridCoords(e);
    drawLine(
      inputRef.current.lastX,
      inputRef.current.lastY,
      x,
      y,
      activeElement,
      eraserSize,
    );
    inputRef.current.lastX = x;
    inputRef.current.lastY = y;
  };

  const handleEnd = () => {
    inputRef.current.isDrawing = false;
  };
  const handleClear = () => {
    if (engineRef.current) engineRef.current.clear();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-arcade-bg text-white font-mono w-full selection:bg-emerald-500/30">
      {/* Visual Identity Header Block */}
      <div className="mb-6 text-center select-none">
        <h1 className="text-2xl tracking-[0.25em] text-emerald-400 font-black mb-1.5 drop-shadow-[0_2px_8px_rgba(52,211,153,0.2)]">
          NEXUS ELEMENTAL ENGINE
        </h1>
        <p className="text-[10px] sm:text-xs text-gray-400 max-w-xl mx-auto tracking-widest leading-relaxed uppercase">
          Real-Time Grid Automata • Fluid Dispersion Model • Decoupled State
          Architecture
        </p>
      </div>

      {/* Main Structural Layout Container (Locked to Center, Elements aligned via md:items-stretch) */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch justify-center w-full max-w-4xl mx-auto bg-gray-950/20 p-4 rounded-xl border border-gray-900/40 backdrop-blur-sm shadow-inner">
        {/* Left Side Control Tower Dashboard */}
        <SandControls
          activeElement={activeElement}
          setActiveElement={setActiveElement}
          onClear={handleClear}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
        />

        {/* Right Side Computational Simulation Frame Canvas */}
        <div className="w-full flex-1 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="w-full aspect-[4/3] bg-gray-950 rounded-lg border border-gray-800/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] cursor-crosshair touch-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
