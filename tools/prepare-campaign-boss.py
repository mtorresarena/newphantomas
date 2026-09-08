"""Remove generated neutral checkerboard (owner-authorized) and measure four poses."""
from pathlib import Path
import sys,json
import numpy as np
from PIL import Image
from scipy import ndimage
root=Path(__file__).resolve().parents[1]
a=np.array(Image.open(sys.argv[1]).convert('RGBA'));rgb=a[:,:,:3].astype(int)
bg=(rgb.min(2)>225)&((rgb.max(2)-rgb.min(2))<18)
a[bg,3]=0
# Poses have different wing widths; boundaries are measured, not equal cells.
assert a.shape[:2]==(724,2172)
cols=[0,445,1080,1600,2172];frames=[]
for x0,x1 in zip(cols,cols[1:]):
 cell=a[:,x0:x1];labels,n=ndimage.label(cell[:,:,3]>0);sizes=np.bincount(labels.ravel());sizes[0]=0
 keep=sizes[labels]>max(12,sizes.max()*.00006);cell[~keep,3]=0
 yy,xx=np.nonzero(keep);frames.append(dict(x=int(x0+xx.min()),y=int(yy.min()),w=int(xx.max()-xx.min()+1),h=int(yy.max()-yy.min()+1)))
a[a[:,:,3]==0,:3]=0
Image.fromarray(a).save(root/'assets/campaign-boss.png',optimize=True)
(root/'assets/campaign-boss-frames.js').write_text('window.CampaignBossFrames='+json.dumps(frames)+';\n')
print(frames)
