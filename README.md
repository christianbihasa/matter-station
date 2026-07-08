# Matter Station

A high-performance, matrix-buffered 2D falling sand and cellular automata physics engine implemented in TypeScript/JavaScript. It utilizes dual `Uint8Array` buffers for grid states and variants to achieve lightweight, deterministic simulation frames.

---

## Core Features

* **Two-Pass Simulation Architecture:** Separates chemical/thermal reactions from physical grid movement to eliminate frame race conditions.
* **Geological Kinetics:** Realistic volcanic modeling featuring magma pool convection, pressurized volcanic gas accumulation, and explosive ballistic blowouts.
* **State-Aware Solid Collision Guardrails:** Falling particles and liquids respect solid structural elements (`state: "SOLID"`), preventing unnatural clipping or displacement.
* **Dynamic Reactions:** Built-in material reactions, including acid corrosion, wood combustion, and **Obsidian Quenching** (Magma + Water $\rightarrow$ Crust + Steam).

---

## Element Profiles

| ID | Element Name | State | Density | Flammable | Behavior / Notes |
| --- | --- | --- | --- | --- | --- |
| **0** | `AIR` | GAS | 0 | No | Empty vacuum space |
| **1** | `SAND` | POWDER | 30 | No | Displaces downward diagonally |
| **2** | `WATER` | LIQUID | 20 | No | High horizontal dispersion rate |
| **3** | `WALL` | SOLID | 100 | No | Indestructible structural material |
| **4** | `OIL` | LIQUID | 10 | **Yes** | Floats on water; highly combustible |
| **5** | `ACID` | LIQUID | 25 | No | Corrodes sand, wood, and walls into steam |
| **6** | `FIRE` | ENERGY | -10 | No | Rises upward; ignites flammable elements |
| **7** | `WOOD` | SOLID | 50 | **Yes** | Structural fuel source for fire and magma |
| **8** | `STEAM` | ENERGY | -5 | No | Translucent vapor that dissipates naturally |
| **9** | `SPOUT` | SOLID | 1000 | No | Infinite generator for `WATER` |
| **10** | `DRAIN` | SOLID | 1001 | No | Destroys any element directly above it |
| **11** | `CRUST` | SOLID | 80 | No | Volcanic igneous rock / Obsidian block |
| **12** | `MAGMA` | LIQUID | 70 | No | Melts crust; flash-cools upon hitting water |
| **13** | `VOLCANIC_GAS` | ENERGY | -50 | No | Highly pressurized gas; causes explosions |

---

## Quick Start

```typescript
import { SandEngine } from './SandEngine';

// Initialize a 150x150 canvas grid with a 4px cell scale
const engine = new SandEngine(150, 150, 4);

// Seed a few elements (X, Y, Element_ID)
engine.setCell(75, 10, 1);  // Drop a grain of sand
engine.setCell(75, 0, 9);   // Place a water spout at the top

function animationLoop() {
  // 1. Process physics passes
  engine.updatePhysics();
  
  // 2. Render the computed matrix array to your canvas context
  engine.drawGrid(canvasContext);
  
  requestAnimationFrame(animationLoop);
}

```

---

## 🧠 Simulation Mechanics

### 1. Pre-Reaction Pass

Before any element takes a step, the engine sweeps top-to-bottom checking local coordinates for chemical interactions. Fire spreads to adjacent `flammable: true` elements, acid erodes obstacles, and touching `MAGMA` and `WATER` triggers an instantaneous state change into solid `CRUST` while generating thermal `STEAM` pockets.

### 2. Main Systemic Motion Sweep

The physical motion cycle sweeps from the bottom-row up to correctly process gravity.

* **Gases & Energy:** Float upwards, swapping positions with lighter blocks.
* **Powders & Liquids:** Fall down or slide sideways based on strict relative density calculations ($Density_{current} > Density_{target}$).
* **Solid States:** Elements marked as `SOLID` refuse downward or horizontal displacement from passing fluids, anchoring your maps securely.
