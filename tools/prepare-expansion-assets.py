"""Prepare generated expansion atlas: remove neutral backdrop and measure frames.
Usage: python tools/prepare-expansion-assets.py source.png
Trophies: python tools/prepare-expansion-assets.py source.png --props
Background cleanup by code was explicitly authorized by the project owner.
"""
import sys,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
root=Path(__file__).resolve().parents[1]
im=Image.open(sys.argv[1]).convert('RGBA')
a=np.array(im);rgb=a[:,:,:3].astype(int)
props='--props' in sys.argv[2:]
background=((rgb[:,:,0]>160)&(rgb[:,:,2]>160)&(rgb[:,:,1]<120)&(rgb[:,:,2]>rgb[:,:,0]*.75)) if props else ((rgb.min(axis=2)>225)&((rgb.max(axis=2)-rgb.min(axis=2))<18))
a[background,3]=0
# Measured row separators of the generated 1448x1086 sheet.
rows=[0,627,1254] if props else [0,323,639,1086];cols=2 if props else 4;cw=627 if props else 362;frames=[];groups=[]
assert im.size==((1254,1254) if props else (1448,1086)), 'Measure boundaries again for a different source.'
for row in range(len(rows)-1):
 group=[]
 for col in range(cols):
  x0=col*cw;y0=rows[row];cell=a[y0:rows[row+1],x0:x0+cw]
  labels,n=ndimage.label(cell[:,:,3]>0)
  sizes=np.bincount(labels.ravel());sizes[0]=0
  keep=labels==sizes.argmax()
  cell[~keep,3]=0
  yy,xx=np.nonzero(keep)
  b=dict(x=int(x0+xx.min()),y=int(y0+yy.min()),w=int(xx.max()-xx.min()+1),h=int(yy.max()-yy.min()+1))
  frames.append(b);group.append(b)
 groups.append(dict(height=max(b['h'] for b in group)))
# RGB of transparent pixels is irrelevant; clear it to keep tools' previews clean.
a[a[:,:,3]==0,:3]=0
Image.fromarray(a).save(root/('assets/expansion-props-v2.png' if props else 'assets/expansion-enemies-v2.png'),optimize=True)
(root/('assets/expansion-prop-frames.js' if props else 'assets/expansion-frames.js')).write_text(('window.ExpansionPropFrames=' if props else 'window.ExpansionFrames=')+json.dumps(dict(frames=frames,groups=groups))+';\n',encoding='utf-8')
print(json.dumps(dict(frames=frames,groups=groups)))
