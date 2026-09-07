"""Prepare the generated atlases, preserving sprite colors and their alpha.

The user explicitly authorized removing the baked checkerboard by code.
Only the neutral bright background is cleared; no resampling or repainting.
Usage: python tools/prepare-garden-assets.py robot-source.png props-source.png
"""
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ASSETS = Path(__file__).resolve().parents[1] / 'assets'


def prepare(source, name):
    image = Image.open(source).convert('RGBA')
    pixels = np.array(image)
    rgb = pixels[:, :, :3].astype(np.int16)
    neutral = (rgb.min(axis=2) >= 220) & (rgb.max(axis=2) - rgb.min(axis=2) < 20)
    height, width = neutral.shape
    frames = []
    # The generated tree extends slightly past the mathematical half-height;
    # these inspected gutters keep whole objects in their cells.
    columns = [0, 450, 920, 1280, width] if name == 'props' else [round(i * width / 4) for i in range(5)]
    rows = [0, 480, height] if name == 'props' else [0, round(height / 2), height]
    for row in range(2):
        for col in range(4):
            left, right = columns[col], columns[col + 1]
            top, bottom = rows[row], rows[row + 1]
            cell = neutral[top:bottom, left:right]
            labels, _ = ndimage.label(cell)
            edges = np.unique(np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1])))
            background = np.isin(labels, edges[edges != 0])
            # Props other than the ivory skull have no neutral-white material;
            # this also clears enclosed gaps between leaves and inside the key.
            if name == 'props' and (row, col) != (0, 3):
                background = cell
            alpha = pixels[top:bottom, left:right, 3]
            alpha[background] = 0
            # A handful of isolated checker specks can be darker at sprite edges.
            # Remove detached fragments below eight pixels, never a body component.
            foreground_labels, count = ndimage.label(alpha > 0)
            sizes = np.bincount(foreground_labels.ravel())
            for label in range(1, count + 1):
                if sizes[label] < 8:
                    alpha[foreground_labels == label] = 0
            # Two source pixels remove the pale matte fringe left by the
            # generator's antialiasing, while retaining its dark pixel outline.
            alpha[~ndimage.binary_erosion(alpha > 0, iterations=2)] = 0
            yy, xx = np.nonzero(alpha)
            if not len(xx):
                raise ValueError(f'Empty sprite: {name} {row},{col}')
            box = {'x': int(left + xx.min()), 'y': int(top + yy.min()),
                   'w': int(xx.max() - xx.min() + 1),
                   'h': int(yy.max() - yy.min() + 1)}
            color = rgb[top:bottom, left:right]
            if name == 'props' and row == 1:
                eye = (color[:, :, 0] > 180) & (color[:, :, 1] < 120) & (color[:, :, 2] < 160) & (alpha > 0)
                eye_y, eye_x = np.nonzero(eye)
                box['pivotX'] = round(float(eye_x.mean() - xx.min()), 2)
                box['pivotY'] = round(float(eye_y.mean() - yy.min()), 2)
            frames.append(box)
    result = Image.fromarray(pixels)
    destination = ASSETS / f'garden-{name}.png'
    result.save(destination, optimize=True)
    assert result.mode == 'RGBA' and result.getchannel('A').getextrema() == (0, 255)
    print(f'{destination.name}: {width}x{height}, alpha OK, {destination.stat().st_size:,} bytes')
    return {'width': width, 'height': height, 'frames': frames}


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    robot = prepare(sys.argv[1], 'robot')
    props = prepare(sys.argv[2], 'props')
    robot['referenceHeight'] = round(float(np.median([b['h'] for b in robot['frames'][:7]])))
    props['batWidth'] = max(b['w'] for b in props['frames'][4:])
    manifest = {'robot': robot, 'props': props}
    (ASSETS / 'garden-frames.js').write_text(
        '// Source rectangles measured from the transparent production atlases.\n'
        'window.GardenFrames = ' + json.dumps(manifest, indent=2) + ';\n', encoding='utf-8')
    print(json.dumps(manifest, indent=2))
