/* ImageLab — shared helpers + global namespace.
   Each tool registers into ImageLab.tools[id] = builderFn(rootEl). */
window.ImageLab = window.ImageLab || { tools: {} };

(function (IL) {
  IL.el = function (tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  IL.fmtBytes = function (b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  };

  IL.MIME = { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', webp: 'image/webp' };
  IL.EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

  // load a File into an HTMLImageElement
  IL.loadImage = function (file) {
    return new Promise((res, rej) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { res(img); };
      img.onerror = () => rej(new Error('Could not read image: ' + file.name));
      img.src = url;
    });
  };

  // draw an image (or canvas) onto a fresh canvas at given size
  IL.toCanvas = function (img, w, h) {
    const c = IL.el('canvas');
    c.width = w || img.naturalWidth || img.width;
    c.height = h || img.naturalHeight || img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  };

  // canvas → Blob with format + quality
  IL.canvasToBlob = function (canvas, mime, quality) {
    return new Promise(res => canvas.toBlob(res, mime, quality));
  };

  IL.dropZone = function (onFiles, accept, multi) {
    const d = IL.el('div', 'drop',
      'Drop image' + (multi ? 's' : '') + ' here or <b>browse</b><div class="hint">processed locally · nothing uploaded</div>');
    const inp = IL.el('input');
    inp.type = 'file'; inp.accept = accept || 'image/*'; inp.multiple = !!multi; inp.style.display = 'none';
    d.appendChild(inp);
    d.onclick = () => inp.click();
    inp.onchange = () => { if (inp.files.length) onFiles([...inp.files]); };
    d.ondragover = e => { e.preventDefault(); d.classList.add('drag'); };
    d.ondragleave = () => d.classList.remove('drag');
    d.ondrop = e => {
      e.preventDefault(); d.classList.remove('drag');
      if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]);
    };
    return d;
  };

  IL.logger = function (parent) {
    const l = IL.el('div', 'log');
    parent.appendChild(l);
    return { set: (m, cls) => { l.innerHTML = cls ? `<span class="${cls}">${m}</span>` : m; } };
  };

  IL.download = function (blob, name) {
    const url = URL.createObjectURL(blob);
    const a = IL.el('a', null, `<span>${name}</span><span class="dl">↓ download</span>`);
    a.href = url; a.download = name;
    return a;
  };

  // zip a list of {name, blob} via fflate, return a single Blob
  IL.zip = async function (entries) {
    if (!window.fflate) throw new Error('ZIP library not loaded.');
    const files = {};
    for (const e of entries) {
      const buf = new Uint8Array(await e.blob.arrayBuffer());
      files[e.name] = buf;
    }
    return new Promise((res, rej) => {
      fflate.zip(files, { level: 6 }, (err, data) => {
        if (err) rej(err); else res(new Blob([data], { type: 'application/zip' }));
      });
    });
  };

  // swap a file extension
  IL.rename = function (name, ext) {
    return name.replace(/\.[^.]+$/, '') + '.' + ext;
  };

  IL.register = function (id, builderFn) { IL.tools[id] = builderFn; };
})(window.ImageLab);
