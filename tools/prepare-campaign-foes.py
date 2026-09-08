"""Prepare the generated scarab/moth atlas; neutral-background cleanup authorized."""
from pathlib import Path
import json,sys
import numpy as np
from PIL import Image
from scipy import ndimage
root=Path(__file__).resolve().parents[1]
a=np.array(Image.open(sys.argv[1]).convert('RGBA'));rgb=a[:,:,:3].astype(int)
a[(rgb.min(2)>225)&((rgb.max(2)-rgb.min(2))<20),3]=0
height,width=a.shape[:2];assert (width,height)==(1774,887)
cols=[0,444,890,1270,1774];rows=[0,425,887];frames=[]
for row in range(2):
 for i in range(4):
  x0,x1=cols[i:i+2];y0,y1=rows[row:row+2];cell=a[y0:y1,x0:x1]
  labels,n=ndimage.label(cell[:,:,3]>0);sizes=np.bincount(labels.ravel());sizes[0]=0
  keep=sizes[labels]>10;cell[~keep,3]=0;yy,xx=np.nonzero(keep)
  frames.append(dict(x=int(x0+xx.min()),y=int(y0+yy.min()),w=int(xx.max()-xx.min()+1),h=int(yy.max()-yy.min()+1)))
a[a[:,:,3]==0,:3]=0
Image.fromarray(a).save(root/'assets/campaign-foes.png',optimize=True)
(root/'assets/campaign-foes-frames.js').write_text('window.CampaignFoeFrames='+json.dumps(frames)+';\n')
print(frames)
