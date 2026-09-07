/* Garden sample UI. All dimensions are logical pixels in the 320px game view. */
(function (root) {
  'use strict';

  // Original compact bitmap alphabet. Drawn as rectangles, so HUD lettering
  // stays aligned with the game pixels and needs no downloadable font.
  const FONT = {
    'A': ['010','101','111','101','101'],
    'B': ['110','101','110','101','110'],
    'C': ['011','100','100','100','011'],
    'D': ['110','101','101','101','110'],
    'E': ['111','100','110','100','111'],
    'F': ['111','100','110','100','100'],
    'G': ['011','100','101','101','011'],
    'H': ['101','101','111','101','101'],
    'I': ['111','010','010','010','111'],
    'J': ['001','001','001','101','010'],
    'K': ['101','101','110','101','101'],
    'L': ['100','100','100','100','111'],
    'M': ['10001','11011','10101','10001','10001'],
    'N': ['1001','1101','1011','1001','1001'],
    'O': ['010','101','101','101','010'],
    'P': ['110','101','110','100','100'],
    'Q': ['010','101','101','011','001'],
    'R': ['110','101','110','101','101'],
    'S': ['011','100','010','001','110'],
    'T': ['111','010','010','010','010'],
    'U': ['101','101','101','101','111'],
    'V': ['101','101','101','101','010'],
    'W': ['10001','10001','10101','11011','10001'],
    'X': ['101','101','010','101','101'],
    'Y': ['101','101','010','010','010'],
    'Z': ['111','001','010','100','111'],
    '0': ['111','101','101','101','111'],
    '1': ['010','110','010','010','111'],
    '2': ['110','001','010','100','111'],
    '3': ['110','001','010','001','110'],
    '4': ['101','101','111','001','001'],
    '5': ['111','100','110','001','110'],
    '6': ['011','100','111','101','111'],
    '7': ['111','001','010','010','010'],
    '8': ['111','101','111','101','111'],
    '9': ['111','101','111','001','110'],
    '/': ['001','001','010','100','100'],
    '%': ['11001','11010','00100','01011','10011'],
    ':': ['0','1','0','1','0'],
    '.': ['0','0','0','0','1'],
    ',': ['00','00','00','01','10'],
    ';': ['00','01','00','01','10'],
    '!': ['1','1','1','0','1'],
    '?': ['110','001','010','000','010'],
    '¡': ['1','0','1','1','1'],
    '¿': ['010','000','010','100','011'],
    '-': ['000','000','111','000','000'],
    '+': ['000','010','111','010','000'],
    '=': ['000','111','000','111','000'],
    '_': ['000','000','000','000','111'],
    '(': ['01','10','10','10','01'],
    ')': ['10','01','01','01','10'],
    '[': ['11','10','10','10','11'],
    ']': ['11','01','01','01','11'],
    '<': ['001','010','100','010','001'],
    '>': ['100','010','001','010','100'],
    "'": ['1','1','0','0','0'],
    '"': ['101','101','000','000','000'],
    '$': ['011','110','111','011','110'],
    '#': ['01010','11111','01010','11111','01010'],
    '&': ['0100','1010','0100','1010','0101'],
    '*': ['000','101','010','101','000'],
    '·': ['0','0','1','0','0'],
    ' ': ['00','00','00','00','00']
  };
  const ACCENTS = {
    'Á': ['A','acute'], 'É': ['E','acute'], 'Í': ['I','acute'],
    'Ó': ['O','acute'], 'Ú': ['U','acute'], 'Ü': ['U','dots'],
    'Ñ': ['N','tilde']
  };
  const COLORS = {
    ink: '#080b20', edge: '#242945', white: '#e8eef8',
    muted: '#727f9c', gold: '#ffce3b', cyan: '#24e6ff'
  };

  function scaleOf(size) {
    return Math.max(1, Math.round(Number(size) || 1));
  }

  function characters(value) {
    return Array.from(String(value == null ? '' : value).normalize('NFC').toUpperCase());
  }

  function glyphFor(char) {
    const accented = ACCENTS[char];
    return FONT[accented ? accented[0] : char] || FONT['?'];
  }

  function textWidth(value, size = 1) {
    const chars = characters(value);
    return Math.max(0, chars.reduce((width, char) => width + glyphFor(char)[0].length + 1, 0) - 1) * scaleOf(size);
  }

  // x/y address the top left of the five-pixel letter body. Accents use
  // the two pixels above it. Alignment is applied to the complete string.
  function drawText(ctx, value, x, y, color, size = 1, align = 'left') {
    const chars = characters(value);
    const scale = scaleOf(size);
    const width = textWidth(value, scale);
    let cursor = Math.round(x - (align === 'center' ? width / 2 : align === 'right' ? width : 0));
    const top = Math.round(y);
    ctx.save();
    ctx.fillStyle = color || COLORS.white;
    for (const char of chars) {
      const glyph = glyphFor(char);
      for (let row = 0; row < glyph.length; row++) {
        for (let col = 0; col < glyph[row].length; col++) {
          if (glyph[row][col] === '1') ctx.fillRect(cursor + col * scale, top + row * scale, scale, scale);
        }
      }
      const accented = ACCENTS[char];
      if (accented) {
        if (accented[1] === 'acute') {
          ctx.fillRect(cursor + 2 * scale, top - 2 * scale, scale, scale);
          ctx.fillRect(cursor + scale, top - scale, scale, scale);
        } else if (accented[1] === 'dots') {
          ctx.fillRect(cursor, top - 2 * scale, scale, scale);
          ctx.fillRect(cursor + 2 * scale, top - 2 * scale, scale, scale);
        } else {
          ctx.fillRect(cursor, top - 2 * scale, 2 * scale, scale);
          ctx.fillRect(cursor + 2 * scale, top - scale, 2 * scale, scale);
        }
      }
      cursor += (glyph[0].length + 1) * scale;
    }
    ctx.restore();
    return width;
  }

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function bagIcon(ctx, x, y) {
    rect(ctx,x+2,y,5,2,'#c88b2c');
    rect(ctx,x+3,y,1,2,'#ffde70');
    rect(ctx,x+3,y+2,3,1,'#69431c');
    rect(ctx,x+2,y+3,5,1,'#efa830');
    rect(ctx,x+1,y+4,7,1,'#e69b26');
    rect(ctx,x,y+5,9,5,'#81511d');
    rect(ctx,x+1,y+5,7,5,'#f3b22f');
    rect(ctx,x+1,y+5,1,4,'#ffdd67');
    rect(ctx,x+7,y+6,1,3,'#c18122');
    rect(ctx,x+1,y+10,7,1,'#ad7423');
    rect(ctx,x+2,y+9,5,1,'#e19a25');
    rect(ctx,x+3,y+5,3,1,'#60411c');
    rect(ctx,x+3,y+6,1,1,'#60411c');
    rect(ctx,x+3,y+7,3,1,'#60411c');
    rect(ctx,x+5,y+8,1,1,'#60411c');
    rect(ctx,x+3,y+9,3,1,'#60411c');
    rect(ctx,x+4,y+4,1,7,'#60411c');
  }

  function keyIcon(ctx, x, y, active) {
    const color = active ? COLORS.gold : '#47516b';
    rect(ctx,x+1,y,3,1,color);
    rect(ctx,x,y+1,1,3,color);
    rect(ctx,x+4,y+1,1,3,color);
    rect(ctx,x+1,y+4,3,1,color);
    rect(ctx,x+4,y+2,5,1,color);
    rect(ctx,x+7,y+3,1,2,color);
    rect(ctx,x+2,y+1,1,1,active ? '#fff1a8' : '#59627b');
  }

  function garlicIcon(ctx, x, y) {
    rect(ctx,x+3,y,2,2,'#82a759');
    rect(ctx,x+2,y+2,4,1,'#e3dac2');
    rect(ctx,x+1,y+3,6,4,'#aeb6c8');
    rect(ctx,x,y+4,8,2,'#d9dce5');
    rect(ctx,x+2,y+3,3,4,'#f8f2db');
    rect(ctx,x+3,y+3,1,4,'#d0c5b6');
    rect(ctx,x+2,y+7,4,1,'#939bad');
  }

  function robotIcon(ctx, x, y, active) {
    const rim = active ? '#738ba7' : '#303b56';
    rect(ctx,x+2,y,5,1,active ? '#c5d4e7' : '#44516a');
    rect(ctx,x+1,y+1,7,2,active ? '#a4b8d1' : '#39455e');
    rect(ctx,x+2,y+1,5,1,active ? '#f0f7ff' : '#4c5972');
    rect(ctx,x,y+3,9,4,rim);
    rect(ctx,x+1,y+3,7,3,'#09142a');
    rect(ctx,x+1,y+7,7,1,rim);
    rect(ctx,x+2,y+8,5,1,active ? '#aec2d8' : '#39455e');
    if (active) {
      rect(ctx,x+2,y+4,2,1,'#28dfff');
      rect(ctx,x+5,y+4,2,1,'#28dfff');
      rect(ctx,x+2,y+4,1,1,'#d6ffff');
      rect(ctx,x+6,y+4,1,1,'#d6ffff');
    }
  }

  function drawHUD(ctx, data) {
    const energy = Math.max(0, Math.min(100, Number(data.energy) || 0));
    const bagCount = Math.max(0, Math.floor(Number(data.bags) || 0));
    const bagTotal = Math.max(0, Math.floor(Number(data.total) || 0));
    const progress = Math.max(0, Math.min(100, Math.round(Number(data.pct) || 0)));
    const keys = Math.max(0, Math.floor(Number(data.keys) || 0));
    const lives = Math.max(0, Math.floor(Number(data.lives) || 0));
    const blink = ((Number(data.frame) || 0) >> 3) & 1;
    ctx.save();
    rect(ctx,0,0,320,15,COLORS.ink);
    rect(ctx,0,14,320,1,COLORS.edge);
    rect(ctx,0,15,320,1,'rgba(2,4,16,.28)');

    drawText(ctx,'ENERGÍA',5,5,COLORS.white);
    const border = energy <= 25 && blink ? '#ff5665' : '#718099';
    rect(ctx,38,4,56,1,border);
    rect(ctx,37,5,1,6,border);
    rect(ctx,94,5,1,6,border);
    rect(ctx,38,11,56,1,border);
    rect(ctx,38,5,56,6,'#02040a');
    const fill = Math.round(energy * 54 / 100);
    if (fill > 0) {
      const high = energy > 50 ? '#adff82' : energy > 25 ? '#fff194' : '#ff9a93';
      const middle = energy > 50 ? '#4deb3b' : energy > 25 ? '#ffd244' : '#ff4e53';
      const low = energy > 50 ? '#1bb82e' : energy > 25 ? '#d79320' : '#c92645';
      rect(ctx,39,6,fill,1,high);
      rect(ctx,39,7,fill,2,middle);
      rect(ctx,39,9,fill,1,low);
      for (let x = 45; x < 39 + fill - 2; x += 10) {
        rect(ctx,x,7,2,1,high);
        rect(ctx,x+3,9,2,1,middle);
      }
    }
    if (data.charging) drawText(ctx,'+',97,5,blink ? '#fff49a' : COLORS.gold);

    bagIcon(ctx,104,2);
    drawText(ctx,String(bagCount).padStart(2,'0') + '/' + String(bagTotal).padStart(2,'0'),117,5,COLORS.gold);
    drawText(ctx,progress + '%',163,5,COLORS.gold,1,'right');

    keyIcon(ctx,170,5,keys > 0);
    drawText(ctx,keys > 9 ? '+' : keys,182,5,keys > 0 ? COLORS.gold : COLORS.muted);
    if (data.garlic) garlicIcon(ctx,194,3);
    rect(ctx,207,4,1,7,'#262d47');

    // Three sockets make remaining lives readable without layout movement.
    for (let i = 0; i < 3; i++) robotIcon(ctx,215 + i * 11,3,i < lives);
    if (lives > 3) drawText(ctx,'+' + (lives - 3),250,5,COLORS.cyan);
    drawText(ctx,'N' + Math.max(1,Math.floor(Number(data.level) || 1)),279,5,COLORS.white,1,'right');
    drawText(ctx,String(data.time || '00:00'),315,5,COLORS.cyan,1,'right');
    ctx.restore();
  }

  root.GardenUI = Object.freeze({drawHUD, drawText, textWidth});
})(typeof window !== 'undefined' ? window : globalThis);
