"""Remove the authorized flat sprite backdrop and measure each animation pair."""
from pathlib import Path
import json
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

root = Path(__file__).resolve().parents[1]
im = Image.open(sys.argv[1]).convert('RGBA')
kind = sys.argv[2] if len(sys.argv)>2 else 'enemies'
a = np.array(im)
rgb = a[:, :, :3].astype(int)
backdrop = (rgb[:, :, 0] > 180) & (rgb[:, :, 2] > 180) & (rgb[:, :, 1] < 100)
a[:, :, 3][backdrop] = 0
frames = []
for index in range(16):
    x0, x1 = round(index % 4 * im.width / 4), round((index % 4 + 1) * im.width / 4)
    y0, y1 = round(index // 4 * im.height / 4), round((index // 4 + 1) * im.height / 4)
    if kind == 'props':
        rows = [[0,343,617,935,1254],[0,322,640,925,1254],[0,334,665,910,1254],[0,340,652,911,1254]][index%4]
        y0,y1 = [round(v*im.height/1254) for v in rows[index//4:index//4+2]]
    alpha = a[y0:y1, x0:x1, 3]
    labels, count = ndimage.label(alpha > 0)
    sizes = np.bincount(labels.ravel())
    # Preserve detached flame sparks, remove subpixel backdrop flecks only.
    keep = sizes >= 5
    keep[0] = False
    alpha[~keep[labels]] = 0
    yy, xx = np.nonzero(alpha)
    frames.append(dict(x=int(x0+xx.min()), y=int(y0+yy.min()), w=int(xx.max()-xx.min()+1), h=int(yy.max()-yy.min()+1)))
Image.fromarray(a).save(root / ('assets/world-'+kind+'.png'))
pairs = [dict(height=max(f['h'] for f in frames[i:i+2])) for i in range(0,16,2)]
(root / ('assets/world-'+('frames' if kind=='enemies' else 'prop-frames')+'.js')).write_text('window.'+('WorldFrames' if kind=='enemies' else 'WorldPropFrames')+' = '+json.dumps(dict(frames=frames,pairs=pairs))+';\n', encoding='utf-8')
print('Transparent atlas saved:', im.size, 'frames:', len(frames))
