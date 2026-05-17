# Icons

Drop the production icons here before deploying:

- `icon-192.png` — 192×192, opaque background, used everywhere.
- `icon-512.png` — 512×512, opaque background, splash-screen source.
- `icon-maskable-512.png` — 512×512 with safe-zone padding (~80% of canvas), referenced as `purpose: "maskable"` in the manifest so Android can crop to the adaptive shape.

Hackathon shortcut: generate all three from a single 1024×1024 source with
[realfavicongenerator.net](https://realfavicongenerator.net/) and drop the PWA outputs here.
