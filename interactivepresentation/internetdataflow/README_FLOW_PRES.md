# 🌐 Internet Flow — How does the Internet work?

Interactive visualization of a data packet's journey from your computer to YouTube.

→ [Technical README](./README_FLOW_TECH.md)

---

## What is this?

A step-by-step animation showing how information travels across the Internet. The student controls the pace by pressing a button, discovering each network element progressively: the home router, the ISP, the intermediate servers, and the final destination.

---

## File Structure

```
internet_flow/
├── index.html           # Entry point
├── css/
│   ├── variables.css    # Design tokens and global reset
│   ├── layout.css       # Page and scene structure
│   ├── nodes.css        # Network nodes, icons and animations
│   └── ui.css           # Buttons, panels, badges and indicators
├── js/
│   ├── config.js        # Router, YT and satellite positions and data
│   ├── state.js         # Global application state
│   ├── path.js          # Route building and node positioning
│   ├── canvas.js        # Line rendering and animated particles
│   ├── nodes.js         # Node initialization and visual control
│   ├── phone.js         # "Information flow" panel (telephone game)
│   ├── steps.js         # Step logic, VPN/satellite setup and return pass
│   ├── modes.js         # Visualization modes and reset
│   ├── variants.js      #5G and satellite variants
│   ├── drag.js          # Drag and drop nodes within the scene
│   └── main.js          # Startup, keyboard and resize listeners
└── img/                 # Images: pc, router, isp, youtube, satellite…
```

---

## Visualization Modes

| Mode | Description |
|---|---|
| **⬜ Empty** | Elements revealed one by one on each ▶️ press |
| **🌐 Normal** | All elements visible from the start |
| **🛡️ VPN** | Adds a VPN node and encrypts traffic |
| **🛸 Satellite** | Signal travels to space before reaching the internet |
| **📶 5G** | Replaces the router and PC with a 5G tower and mobile phone |

Modes are combinable: VPN + Satellite + 5G can all be active at once.

---

## Visualization Flow

1. The student presses **▶️** to advance hop by hop.
2. Each node lights up when reached and shows a description in the top banner.
3. The left panel shows the "telephone game": how each node forwards the message.
4. On reaching YouTube, a confirmation badge appears and the **automatic return pass** begins.
5. The return pass traces the reverse path with green particles.

Nodes are **draggable**: the teacher can reposition them live during the explanation.

---

## Classroom Use

- **⬜ Empty** mode to discover the network step by step with the group.
- **🌐 Normal** mode to explain the full picture from the start.
- Enable **🛡️ VPN** to show what changes when a VPN is in use.
- Enable **🛸 Satellite** to compare satellite routing with terrestrial routing.
- **→** and **Space** keys advance the step (compatible with presentation remotes).
