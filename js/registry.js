/* ImageLab — tool registry (metadata only; builders in js/tools/*.js)
   primary:true  → rendered as oversized primary cards (top of page)
   g: '...'      → starts a secondary group section
   soon:true     → shown disabled */
window.ImageLab = window.ImageLab || { tools: {} };

window.ImageLab.registry = [
  // ----- primary (oversized) -----
  { id: 'compress', ico: '⤓', t: 'Compress', d: 'Shrink file size with a live quality preview.', primary: true },
  { id: 'convert',  ico: '⇄', t: 'Convert',  d: 'PNG, JPEG, WebP — batch, one click.',          primary: true },
  { id: 'resize',   ico: '⤢', t: 'Resize',   d: 'Scale by pixels, percent, or fit.',            primary: true },

  // ----- secondary groups -----
  { g: 'Edit' },
  { id: 'crop',      ico: '⌗', t: 'Crop',          d: 'Drag a region or pick a fixed aspect ratio.' },
  { id: 'transform', ico: '⟳', t: 'Rotate & flip', d: 'Rotate 90° steps, flip horizontally / vertically.' },
  { id: 'watermark', ico: '※', t: 'Watermark',     d: 'Overlay text on one image or a whole batch.' },

  { g: 'Utility' },
  { id: 'favicon', ico: '◧', t: 'Favicon set', d: 'Generate 16–512px icons + ZIP from one image.' },
  { id: 'exif',    ico: '⊗', t: 'Strip EXIF',  d: 'Remove camera/location metadata. Re-encode clean.' },

  { g: 'Heavier — loads on demand' },
  { id: 'bgremove', ico: '◑', t: 'Background remover', d: 'Cut out the subject. Needs an ONNX model.', soon: true },
  { id: 'upscale',  ico: '⤊', t: 'Upscaler',          d: 'Enlarge without blur. Needs ESRGAN WASM.', soon: true }
];
