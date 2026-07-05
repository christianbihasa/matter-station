import React from "react";

export default function SandControls({
  activeElement,
  setActiveElement,
  onClear,
  eraserSize,
  setEraserSize,
}) {
  const elements = [
    ["SAND", 1, "text-yellow-400 border-yellow-500/20 bg-yellow-500/5"],
    ["WATER", 2, "text-blue-400 border-blue-500/20 bg-blue-500/5"],
    ["OIL", 4, "text-amber-500 border-amber-600/20 bg-amber-600/5"],
    ["ACID", 5, "text-green-400 border-green-500/20 bg-green-500/5"],
    ["FIRE", 6, "text-red-400 border-red-500/20 bg-red-500/5"],
    ["WOOD", 7, "text-amber-700 border-amber-800/20 bg-amber-800/5"],
    ["WALL", 3, "text-slate-400 border-slate-500/20 bg-slate-500/5"],
    ["STEAM", 8, "text-slate-300 border-slate-400/20 bg-slate-400/5"],
    ["SPOUT", 9, "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"],
    ["DRAIN", 10, "text-violet-400 border-violet-500/20 bg-violet-500/5"],
    ["ERASER", 0, "text-rose-400 border-rose-500/20 bg-rose-500/5"],
  ];

  return (
    <div className="flex flex-col bg-gray-900/50 p-4 rounded-lg border border-gray-800/60 text-xs w-full md:w-52 select-none shrink-0 self-stretch">
      {/* Locked Header Block */}
      <div className="text-gray-500 font-bold tracking-wider mb-3 uppercase border-b border-gray-800 pb-1 shrink-0">
        Matter Toolkit
      </div>

      {/* Flexible Elements Container (Padding added to prevent active ring clipping) */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-1.5 pt-1.5 pb-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-800">
        {elements.map(([name, id, style]) => (
          <div key={id} className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => setActiveElement(id)}
              className={`w-full px-3 py-2 border rounded tracking-widest transition-all active:scale-95 cursor-pointer font-bold text-left ${style} ${
                activeElement === id
                  ? "ring-1 ring-offset-2 ring-offset-slate-950 ring-emerald-500 opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              {name}
            </button>

            {id === 0 && activeElement === 0 && (
              <div className="p-2 bg-gray-950/60 rounded border border-rose-950/40 flex flex-col gap-1.5 transition-all">
                <div className="flex justify-between text-[10px] text-rose-400/80 font-bold px-1">
                  <span>RADIUS:</span>
                  <span>{eraserSize}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pinned Bottom Block */}
      <div className="mt-3 border-t border-gray-800 pt-3 shrink-0">
        <button
          onClick={onClear}
          className="w-full px-3 py-2.5 border rounded tracking-widest transition-all active:scale-95 cursor-pointer font-bold text-gray-400 border-gray-500/20 bg-gray-500/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
