/* Pixel garden presentation. The original simulation does not depend on this file. */
(function (root) {
  'use strict';
  const images = {};
  const failures = [];
  const base = new URL('.', document.currentScript.src);

  function load(name, file) {
    const image = new Image();
    images[name] = image;
    image.onerror = function () {
      failures.push(name);
      console.warn('Phantomas: no se pudo cargar ' + file + '; se conserva el dibujo anterior.');
    };
    image.src = new URL(file, base).href;
  }
  load('background', 'garden-background.png');
  load('robot', 'garden-robot.png');
  load('props', 'garden-props.png');

  function ready(name) {
    const image = images[name];
    return !!(image && image.complete && image.naturalWidth > 0);
  }

  function frame(name, index) {
    const sheet = root.GardenFrames && root.GardenFrames[name];
    return sheet && sheet.frames[index];
  }

  function blit(g, name, index, x, y, width, height) {
    if (!ready(name)) return false;
    const box = frame(name, index);
    if (!box) return false;
    g.save();
    g.imageSmoothingEnabled = false;
    g.drawImage(images[name], box.x, box.y, box.w, box.h, x, y, width, height);
    g.restore();
    return true;
  }

  function drawBackground(g, cameraX, time) {
    if (!ready('background')) return false;
    g.save();
    g.imageSmoothingEnabled = false;
    // Overscan allows a slow, continuous camera drift without repeating the castle.
    const offset = Math.max(0, Math.min(32, cameraX * 0.055));
    g.drawImage(images.background, -32 - offset, -20, 384, 230.4);
    // The tiny lights are a separate moving foreground plane.
    for (let i = 0; i < 14; i++) {
      const x = ((i * 67 + 19 - cameraX * 0.65) % 370 + 370) % 370 - 25;
      const y = 127 + (i * 19) % 29 + Math.sin(time * 0.022 + i * 2) * 3;
      const alpha = Math.max(0, Math.sin(time * 0.035 + i * 7)) * 0.55;
      g.globalAlpha = alpha;
      g.fillStyle = '#b9ffc0';
      g.fillRect(Math.round(x * 2) / 2, Math.round(y * 2) / 2, 0.5, 0.5);
    }
    g.restore();
    return true;
  }

  function drawRobot(g, x, y, face, pose, time, options) {
    if (!ready('robot') || !frame('robot', 0)) return false;
    options = options || {};
    let index = pose === 'run' ? Math.floor(time / 6) % 4 :
      pose === 'jump' ? 5 : pose === 'fall' ? 6 : pose === 'hurt' ? 7 : 4;
    const box = frame('robot', index);
    const scale = 18 / root.GardenFrames.robot.referenceHeight;
    const width = box.w * scale, height = box.h * scale;
    const squash = options.squash || 0;
    g.save();
    g.translate(x + 5, y + 18);
    g.scale(face < 0 ? -1 : 1, 1);
    g.scale(1 + squash, 1 - squash);
    if (options.tilt) g.rotate(options.tilt * 1.7);
    if (pose === 'idle') g.translate(0, Math.round(Math.sin(time * 0.08)) * 0.15);
    if (options.flash) g.filter = 'brightness(2)';
    blit(g, 'robot', index, -width / 2, -height, width, height);
    g.restore();
    return true;
  }

  function drawBat(g, x, y, time, face) {
    if (!ready('props') || !frame('props', 4)) return false;
    const index = 4 + Math.floor(time / 5) % 4;
    const box = frame('props', index);
    const scale = 23 / root.GardenFrames.props.batWidth;
    const width = box.w * scale, height = box.h * scale;
    g.save();
    g.translate(x + 6, y + 3.5);
    if (face < 0) g.scale(-1, 1);
    blit(g, 'props', index, -box.pivotX * scale, -box.pivotY * scale, width, height);
    g.restore();
    return true;
  }

  function drawTree(g, centerX, groundY, height) {
    const box = frame('props', 0);
    if (!box) return false;
    height = height || 53;
    const width = height * box.w / box.h;
    return blit(g, 'props', 0, centerX - width / 2, groundY - height, width, height);
  }

  root.GardenArt = {
    ready,
    get failures() { return failures.slice(); },
    drawBackground,
    drawRobot,
    drawBat,
    drawTree,
    drawBag: (g, x, y) => blit(g, 'props', 1, x - 0.5, y - 1, 11, 13),
    drawKey: (g, x, y) => blit(g, 'props', 2, x - 0.5, y - 0.5, 10, 6),
    drawSkull: (g, x, y) => blit(g, 'props', 3, x - 0.5, y - 0.5, 11, 11)
  };
})(window);
