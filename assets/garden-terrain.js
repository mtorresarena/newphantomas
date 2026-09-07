/* Garden artwork. World tiles remain 16 px; this palette is drawn at 2x.
 * Rendering only: it deliberately does not own any level or collision data.
 */
(function () {
  'use strict';

  const SIZE = 32;
  const tileCache = new Map();
  const acidCache = new Map();
  const variants = { G: 24, g: 24, '=': 12, '^': 4 };

  function seedFor(col, row) {
    let n = Math.imul((col | 0) + 349, 374761393) ^ Math.imul((row | 0) + 719, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return (n ^ (n >>> 16)) >>> 0;
  }

  function random(seed) {
    let n = seed >>> 0;
    return function () {
      n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
      return n / 4294967296;
    };
  }

  function rect(g, color, x, y, width, height) {
    g.fillStyle = color;
    g.fillRect(x, y, width, height);
  }

  function bitmap(height, painter) {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = height;
    const g = canvas.getContext('2d');
    g.imageSmoothingEnabled = false;
    painter(g);
    return canvas;
  }

  // Each stone is a small stepped silhouette with a lit crown and a shaded
  // lower/right face. Keeping the marks clustered makes the earth read as
  // rock strata, rather than unstructured per-pixel noise.
  function rock(g, x, y, w, h, palette) {
    const [body, light, shadow, glint] = palette;
    rect(g, shadow, x + 2, y, w - 4, h);
    rect(g, shadow, x + 1, y + 1, w - 2, h - 2);
    rect(g, shadow, x, y + 3, w, Math.max(1, h - 5));
    rect(g, body, x + 2, y + 1, w - 4, h - 3);
    rect(g, body, x + 1, y + 3, w - 3, Math.max(1, h - 6));
    rect(g, light, x + 2, y + 1, w - 5, 2);
    rect(g, light, x + 1, y + 3, 2, Math.max(1, (h >> 1) - 2));
    rect(g, glint, x + 3, y + 1, Math.max(2, (w >> 1) - 3), 1);
    rect(g, shadow, x + w - 3, y + 4, 2, Math.max(1, h - 6));
    rect(g, '#332320', x + 3, y + h - 1, w - 5, 1);
  }

  function earth(g, variant) {
    const rnd = random(seedFor(variant, 43));
    rect(g, '#30221d', 0, 0, SIZE, SIZE);
    const palettes = [
      ['#82502b', '#a26a36', '#573820', '#b47b41'],
      ['#714629', '#955e30', '#49311f', '#ad7340'],
      ['#946038', '#b47942', '#654124', '#c0894c'],
      ['#64442e', '#89613c', '#412d24', '#9c7049']
    ];
    for (let band = -1; band < 4; band++) {
      let x = -13 + ((band & 1) ? 6 : 0) + Math.floor(rnd() * 3);
      const y = band * 11 + 1;
      while (x < SIZE) {
        const w = 9 + Math.floor(rnd() * 5);
        const h = 9 + Math.floor(rnd() * 4);
        rock(g, x, y + Math.floor(rnd() * 3), w, h, palettes[Math.floor(rnd() * palettes.length)]);
        x += w + 1;
      }
    }
    // A pair of little roots connects the soil to the vegetation above it.
    const rootX = 3 + (variant * 7) % 24;
    rect(g, '#3c2b20', rootX, 0, 1, 7);
    rect(g, '#3c2b20', rootX + 1, 5, 1, 4);
    rect(g, '#3c2b20', rootX - 1, 8, 2, 1);
  }

  function grass(g, variant) {
    const rnd = random(seedFor(variant, 97));
    rect(g, '#183d23', 0, 4, SIZE, 5);
    rect(g, '#236b1c', 0, 3, SIZE, 4);
    rect(g, '#4fbc13', 0, 1, SIZE, 4);
    rect(g, '#a5f331', 0, 0, SIZE, 2);
    rect(g, '#d2ff6c', 0, 0, SIZE, 1);
    const greens = ['#79d91b', '#9bec24', '#58bf14', '#b7fa36'];
    for (let x = 0; x < SIZE; x += 3) {
      const w = 2 + Math.floor(rnd() * 2);
      const depth = 2 + Math.floor(rnd() * 4);
      rect(g, greens[Math.floor(rnd() * greens.length)], x, 1, w, depth);
      if (rnd() > 0.4) rect(g, '#d8ff74', x, 0, 1, 2);
      if (rnd() > 0.45) {
        rect(g, '#175329', x + 1, 5, 2, depth + 1);
        rect(g, '#2d8c23', x + 1, 4, 1, depth);
        rect(g, '#63bb22', x + 1, 4, 1, 2);
      }
    }
    // Rare brighter hanging blades lend variation without a jagged collision edge.
    const x = 4 + (variant * 11) % 25;
    rect(g, '#1b5229', x, 5, 3, 6);
    rect(g, '#379323', x, 5, 2, 4);
    rect(g, '#69c52a', x, 5, 1, 2);
  }

  function platform(g, variant) {
    const rnd = random(seedFor(variant, 137));
    rect(g, '#372b22', 0, 0, SIZE, 12);
    rect(g, '#965525', 0, 1, SIZE, 9);
    rect(g, '#c88230', 0, 1, SIZE, 6);
    rect(g, '#e2a344', 0, 1, SIZE, 3);
    rect(g, '#f8cd72', 0, 0, SIZE, 1);
    rect(g, '#5c391f', 0, 10, SIZE, 1);
    for (let x = -2 + (variant % 3); x < SIZE; x += 11) {
      rect(g, '#82491f', x, 2, 1, 8);
      rect(g, '#efbb57', x + 1, 2, 1, 5);
      rect(g, '#ffd991', x + 2, 1, 7, 1);
      rect(g, '#af692a', x + 3, 7, 6, 2);
      rect(g, '#d89338', x + 4, 4, 4, 2);
      rect(g, '#6b542e', x + 7, 4, 2, 2);
      rect(g, '#d3b174', x + 7, 4, 1, 1);
      if (rnd() > 0.32) {
        rect(g, '#305c27', x + 2, 9, 4, 2);
        rect(g, '#597f2c', x + 3, 8, 2, 2);
        rect(g, '#8caa3a', x + 3, 8, 1, 1);
      }
    }
  }

  function spikes(g, variant) {
    rect(g, '#253444', 0, 28, SIZE, 4);
    rect(g, '#566578', 0, 28, SIZE, 1);
    for (let x = 0; x < SIZE; x += 8) {
      const tip = 13 + ((x / 8 + variant) % 2);
      for (let y = tip; y < 28; y++) {
        const half = Math.min(3, Math.floor((y - tip) / 3));
        rect(g, '#69798e', x + 3 - half, y, half * 2 + 1, 1);
        rect(g, '#b8cbda', x + 3 - half, y, half + 1, 1);
        rect(g, '#eaf8f5', x + 3 - half, y, 1, 1);
        if (half > 1) rect(g, '#3b4b63', x + 3 + half, y, 1, 1);
      }
    }
  }

  function getTile(ch, variant) {
    const key = ch + variant;
    if (!tileCache.has(key)) {
      tileCache.set(key, bitmap(ch === '=' ? 12 : SIZE, function (g) {
        if (ch === 'G' || ch === 'g') {
          earth(g, variant);
          if (ch === 'G') grass(g, variant);
        } else if (ch === '=') platform(g, variant);
        else spikes(g, variant);
      }));
    }
    return tileCache.get(key);
  }

  function getAcid(phase, variant, surface) {
    const key = phase + ':' + variant + ':' + Number(surface);
    if (!acidCache.has(key)) {
      acidCache.set(key, bitmap(SIZE, function (g) {
        // Match the original visible acid surface around world y + 5.
        // Deeper rows have no empty strip, so tall pools stay continuous.
        const wave = [0, 0, 1, 1, 0, 0, -1, -1][phase];
        const top = surface ? 9 + wave : 0;
        rect(g, '#176329', 0, top, SIZE, SIZE - top);
        rect(g, '#249423', 0, top, SIZE, Math.min(17, SIZE - top));
        rect(g, '#55c925', 0, top, SIZE, Math.min(11, SIZE - top));
        rect(g, '#98e932', 0, top, SIZE, Math.min(6, SIZE - top));
        if (surface) {
          rect(g, '#d9ff51', 0, top, SIZE, 3);
          rect(g, '#f1ff9a', 0, top, SIZE, 1);
        }
        const streak = (variant * 7 + phase * 2) % 32;
        for (const start of [streak - 32, streak]) {
          rect(g, '#b9f34b', start, top + 4, 13, 1);
          rect(g, '#78d22d', start + 7, top + 9, 14, 2);
          rect(g, '#3cad29', start - 4, 24, 19, 1);
          rect(g, '#227b2b', start + 3, 29, 18, 2);
        }
        // A limited phase atlas gives gently rising pixel bubbles without
        // creating a new canvas every frame or depending on camera position.
        const bx = 4 + (variant * 5) % 23;
        const by = surface ? top + 7 - ((phase + variant) % 6) : 23 - phase * 2;
        if ((variant + phase) % 4 !== 0) {
          rect(g, '#d7ff72', bx, by, 2, 3);
          rect(g, '#9ce943', bx - 1, by + 1, 4, 1);
          rect(g, '#f1ffd0', bx, by, 1, 1);
        }
        if (surface && (phase + variant) % 8 < 3) {
          const px = 6 + (variant * 11) % 20;
          const py = Math.max(1, top - 3 - (phase % 3));
          rect(g, '#aadf4c', px, py, 3, 3);
          rect(g, '#edffa1', px + 1, py, 1, 1);
          rect(g, '#e5ff80', px, py + 1, 1, 1);
        }
      }));
    }
    return acidCache.get(key);
  }

  window.GardenTerrain = {
    drawTile: function (ctx, ch, x, y, col, row, frame) {
      if (!Object.prototype.hasOwnProperty.call(variants, ch)) return false;
      const variant = seedFor(col, row) % variants[ch];
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(getTile(ch, variant), x, y, 16, ch === '=' ? 6 : 16);
      ctx.restore();
      return true;
    },

    drawAcid: function (ctx, x, y, col, row, frame, isSurface) {
      const phase = (Math.floor((Number(frame) || 0) / 7) % 8 + 8) % 8;
      const variant = seedFor(col, row) % 8;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(getAcid(phase, variant, isSurface !== false), x, y, 16, 16);
      ctx.restore();
      return true;
    }
  };
}());
