# Snow-and-Wave

A browser-based pixel RPG built with Phaser 3.

## Story

An ocean person tired of undersea life washes ashore at a snow village where villagers and reindeer live together. Explore the village, talk to NPCs, and watch your choices ripple through the world.

## How to Run

Because the game uses ES modules, you need a local server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

## Controls

- **WASD** or **Arrow keys** — move
- **E** — interact with nearby NPC
- **1 / 2 / 3** — select dialogue choice by number
- **ESC** — close dialogue

## Butterfly Effect

Actions you take visibly change the world:

- Help the reindeer → it glows green
- Gain the Elder's trust (relation >= 30) → Elder gets a warm golden tint
- Choose to repel the wolf attack → "村庄守护者" text appears near the village entrance

## File Structure

```
index.html
src/
  main.js
  scenes/
    BootScene.js    — generates all pixel art textures programmatically
    WorldScene.js   — tile map, player movement, NPC placement
    DialogScene.js  — dialogue overlay with choice trees
  systems/
    EventFlags.js   — global boolean flags
    RelationSystem.js — NPC relationship values (0-100)
    TriggerSystem.js  — reacts to flags/relations and updates visuals
  entities/
    NPC.js          — NPC sprite with name label and interaction hint
  data/
    npcs.js         — dialogue trees for all NPCs
```
