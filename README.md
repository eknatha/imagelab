# ImageLab

Offline image toolkit — part of the [EknathaLabs](https://eknathalabs.com) ecosystem.

**No uploads. No backend. Every operation runs entirely in your browser.**

Live: [imagelab.eknathalabs.com](https://imagelab.eknathalabs.com)

Sibling project: [PaperLab](https://paperlab.eknathalabs.com) (PDF toolkit) — shares the same architecture.

## Architecture

Multi-file vanilla HTML/CSS/JS — no build step, no framework. `index.html` is a thin
shell that loads a shared core plus one self-registering module per tool.

```
imagelab/
├── index.html              # shell: markup + script tags only
├── css/styles.css          # all styling (cyan accent)
├── js/
│   ├── helpers.js          # ImageLab namespace + canvas/zip utils
│   ├── registry.js         # tool metadata
│   ├── app.js              # grid render + workspace modal + boot
│   └── tools/              # one file per tool, each calls ImageLab.register(id, fn)
│       ├── convert.js
│       ├── compress.js
│       ├── resize.js
│       ├── crop.js
│       ├── transform.js
│       ├── watermark.js
│       ├── favicon.js
│       └── exif.js
├── vendor/                 # (optional) drop fflate here for zero-network
├── CNAME
└── .nojekyll
```

### Adding a tool

1. Create `js/tools/<id>.js`:
   ```js
   (function (IL) {
     IL.register('<id>', function (root) { /* build UI into root */ });
   })(window.ImageLab);
   ```
2. Add a metadata entry to `js/registry.js`.
3. Add a `<script src="js/tools/<id>.js">` line in `index.html`.

## Tools (Phase 1)

| Group | Tool | Notes |
|---|---|---|
| Convert & optimize | Convert (PNG/JPEG/WebP), Compress (quality + before/after), Resize | batch + ZIP |
| Edit | Crop (drag/ratio), Rotate & flip, Watermark | |
| Utility | Favicon set (multi-size + HTML snippet), Strip EXIF | privacy |

All processing uses the Canvas API. Batch jobs bundle into a ZIP via `fflate`.

## Coming (lazy-loaded WASM/model modules)

- **Background remover** — U2Net-style segmentation via ONNX Runtime Web
- **Upscaler** — ESRGAN via WASM / WebGPU

Kept out of the base build so the core stays light; they load only when used.

## Engines

`fflate` (ZIP) loads from CDN by default. For **true zero-network**, download it into
`vendor/` and repoint the `<script>` tag in `index.html`. Everything else is native
browser Canvas — no other dependencies.

## Known limits (honest)

- WebP/AVIF encoding depends on browser support (modern Chromium/Firefox fine; older Safari limited).
- Canvas re-encoding is lossy for JPEG/WebP — PNG stays lossless.
- Stripping EXIF works by re-encoding; it does not edit the original file in place.

## Deploy (GitHub Pages)

1. Push to the `imagelab` repo (preserve `css/` and `js/tools/` paths).
2. Settings → Pages → deploy from `main` / root.
3. DNS: add CNAME record `imagelab` → `eknatha.github.io`.
4. The `CNAME` file binds the custom domain; `.nojekyll` keeps Pages from filtering paths.
