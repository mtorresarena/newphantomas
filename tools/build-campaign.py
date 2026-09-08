"""Campaign 3: authored puzzle chambers, traversal sequences and the N8 boss.
Rebuilds marked content only. No random rooms, no runtime dependency on Python.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
class Room:
 def __init__(self,theme,name,width,lesson,part):
  self.w=width;self.grid=[list('.'*width) for _ in range(12)]
  for y in (0,10,11):self.grid[y]=list('#'*width)
  self.data=dict(t=theme,label=name,lesson=lesson,part=part,parts=5,trials=[],hazards=[],foes=[])
  self.put(3,9,'P' if part==1 else 'C')
  if part in (1,3,5):self.put(7,9,'E')
  else:self.put(7,9,'b')
 def put(self,x,y,value):
  for i,ch in enumerate(value):
   assert self.grid[y][x+i] in '.#~' or self.grid[y][x+i]==ch,(self.data['label'],x+i,y,self.grid[y][x+i],ch)
   self.grid[y][x+i]=ch
  return self
 def platform(self,x,y,w,ch='='):return self.put(x,y,ch*w)
 def block(self,x,y,w):
  for row in range(y,10):self.put(x,row,'#'*w)
  return self
 def pit(self,x,w):
  for y in (10,11):self.put(x,y,'~'*w)
  return self
 def end(self,goal=False):
  if goal:self.put(self.w-5,9,'S')
  else:self.put(self.w-4,9,'b')
  self.data['rows']=[''.join(r) for r in self.grid];return self.data

def node(col,row,id,role='switch',**kw):return dict(col=col,row=row,id=str(id),glyph=str(id),role=role,**kw)
def connected_trial(r,t,a,idx,family):
 p=r.data['part']
 if family==1 and p==3 and idx==2:
  t.update(name='LA BALANZA DE DOS ALTURAS',relay=True,nodes=[node(a+23,9,1,'stone'),node(a+4,7,2,'socket'),node(a+23,3,3,'latch'),node(a+4,3,4,'socket')],
   bridges=[dict(col=a+10,row=6,width=4),dict(col=a+16,row=4,width=4)],
   hint='Lleva el peso a la balanza baja. Sube por su escalera hasta el cerrojo 3 y fíjala. Recupera el peso de la balanza baja y vuelve por la escalera hacia la balanza alta.')
  r.platform(a+2,8,5).platform(a+21,4,6).platform(a+2,4,5)
  return True
 if family==1 and p==5 and idx==1:
  t.update(name='EL RELOJ DE LAS PASARELAS',order=['1','2','3'],duration=660,
   nodes=[node(a+24,9,1),node(a+14,5,2),node(a+4,3,3)],
   bridges=[dict(col=a+18,row=8,width=5,stages=[1]),dict(col=a+12,row=6,width=5,stages=[1,2,3]),dict(col=a+6,row=4,width=5,stages=[2,3]),dict(col=a+20,row=7,width=5,stages=[2,3])],
   hint='Explora antes de arrancar. El 1 despliega la subida al 2. El 2 retira el apoyo bajo y despliega el camino alto hacia el 3. Actívalo y regresa a la puerta por la pasarela de la derecha.')
  r.platform(a+1,4,5)
  r.data['foes'].append(dict(kind='moth',col=a+24,row=3))
  return True
 if family==2 and p==5 and idx==2:
  t.update(name='LOS DOS DESTINOS DE LA LUZ',dualLight=True,
   nodes=[node(a+1,8,'L','source',dir=1),node(a+8,8,'A','mirror',angle=1),node(a+8,3,'B','mirror'),node(a+22,3,'C','mirror',angle=1),node(a+22,6,'D','mirror',angle=1),node(a+15,3,'E','prism'),node(a+6,6,'R','receiver'),node(a+15,9,'S','receiver')],
   bridges=[dict(col=a+12,row=7,width=5),dict(col=a+16,row=5,width=4),dict(col=a+13,row=4,width=5)],
   hint='Conserva A y D. Gira B y C para llevar la luz hasta R pasando por E. R fija la pasarela. Sube al prisma E y pulsa Abajo para desviar la misma luz hacia S.')
  r.platform(a+6,9,5).platform(a+3,7,4).platform(a+6,4,5).platform(a+20,4,5).platform(a+20,7,5)
  return True
 return False
def authored_variant(r,t,a,idx):
 p=r.data['part'];kind=t['kind']
 if kind=='timed' and p>=3:
  if p==3:
   t.update(order=['1','2','3'],duration=660,nodes=[node(a+3,5,1),node(a+23,9,2),node(a+15,5,3)],hint='Activa 1 en alto, baja al 2 del fondo y vuelve al 3 central antes de cruzar.')
   r.platform(a+1,6,5).platform(a+4,8,4).platform(a+10,8,4).platform(a+13,6,5).platform(a+20,7,5)
  elif p==4:
   t.update(order=['2','1','3'],duration=780,nodes=[node(a+3,3,1),node(a+24,9,2),node(a+21,6,3)],hint='Empieza por el 2 del fondo. Regresa hasta el 1 alto y vuelve al 3: 2 > 1 > 3.')
   r.platform(a+1,4,5).platform(a+7,6,5).platform(a+13,8,5).platform(a+19,7,6)
  elif idx==1:
   t.update(order=['1','2','3'],duration=720,nodes=[node(a+24,9,1),node(a+14,5,2),node(a+4,3,3)],hint='El reloj empieza al fondo. Sube de regreso por 1 > 2 > 3 y vuelve hacia la salida.')
   r.platform(a+18,8,5,'_').platform(a+12,6,5).platform(a+6,4,5).platform(a+1,4,5)
  else:
   t.update(order=['1','2','3'],duration=420,nodes=[node(a+4,3,1),node(a+14,6,2),node(a+24,9,3)],hint='Sube en el montacargas antes de activar 1. Desciende por los apoyos: 1 > 2 > 3, evitando el ácido.')
   r.put(a+6,7,'!').platform(a+1,4,6).platform(a+2,8,3).platform(a+8,6,3,'_').platform(a+11,7,6).platform(a+20,8,4).pit(a+9,11)
  r.put(a+16,5,'$');t['name']='RELOJ DE REGRESO' if idx==1 or p<5 else 'DESCENSO SINCRONIZADO'
  return True
 if kind=='mirror' and p>=3:
  if p==3:
   t['nodes']=[node(a+2,3,'L','source',dir=1),node(a+10,3,'A','mirror',angle=1),node(a+10,8,'B','mirror'),node(a+23,8,'C','mirror'),node(a+23,3,'R','receiver')]
   r.platform(a+3,8,4).platform(a+6,6,4).platform(a+8,4,5).platform(a+8,9,5).platform(a+21,9,5)
   t['hint']='La luz parte desde arriba: baja por A y B y vuelve a subir desde C al receptor.'
  elif p==4:
   t['nodes']=[node(a+24,9,'L','source',dir=3),node(a+18,9,'A','mirror'),node(a+18,3,'B','mirror',angle=1),node(a+4,3,'C','mirror'),node(a+4,7,'R','receiver')]
   r.platform(a+2,4,5).platform(a+7,6,4).platform(a+12,8,4).platform(a+17,6,5).platform(a+16,4,5)
   t['hint']='La lámpara está a la derecha. Sigue el rayo hacia A, sube por B y baja desde C al receptor izquierdo.'
  elif idx==1:
   t['nodes']=[node(a+23,4,'L','source',dir=3),node(a+15,4,'A','mirror'),node(a+15,9,'B','mirror',angle=1),node(a+4,9,'C','mirror',angle=1),node(a+4,3,'R','receiver')]
   r.platform(a+4,8,4).platform(a+9,6,4).platform(a+13,5,5)
   t['hint']='Lleva el rayo por debajo: A baja, B lo devuelve a la izquierda y C lo sube al receptor.'
  else:
   t['nodes']=[node(a+1,8,'L','source',dir=1),node(a+8,8,'A','mirror',angle=1),node(a+8,3,'B','mirror'),node(a+22,3,'C','mirror',angle=1),node(a+22,6,'D','mirror',angle=1),node(a+14,6,'R','receiver')]
   r.platform(a+6,9,5).platform(a+3,7,4).platform(a+6,4,5).platform(a+12,6,4).platform(a+16,5,4).platform(a+20,4,5).platform(a+20,7,5)
   t['hint']='El receptor está dentro del circuito. Sube por A, cruza B, baja por C y vuelve hacia dentro desde D.'
  t['name']='CIRCUITO DE RETORNO';return True
 if kind=='weight' and p==5:
  t.update(nodes=[node(a+23,2,1,'stone'),node(a+3,6,2,'socket')],name='EL PESO DE LA CORONA',hint='Sube sin peso hasta la corona. Recógela y regresa descendiendo hasta la balanza izquierda; evita al guardián del suelo.')
  r.platform(a+2,7,6).platform(a+8,5,5).platform(a+14,7,4).platform(a+19,5,4).platform(a+22,3,5).put(a+11,9,'K')
  return True
 return False

def trial(r,kind,a,idx,advanced=False,family=-1):
 t=dict(id=f"{r.data['part']}-{idx}",kind=kind,name={'charge':'SELLOS DE PIEDRA','weight':'CONTRAPESO','timed':'ESCAPAMIENTO','sequence':'RUNAS','mirror':'HAZ DE LUZ'}[kind],gate=a+28,symbol={'charge':'!','weight':'O','timed':'T','sequence':'3','mirror':'/'}[kind])
 if connected_trial(r,t,a,idx,family):
  r.data['trials'].append(t);return
 if advanced and authored_variant(r,t,a,idx):
  r.data['trials'].append(t);return
 if kind=='charge':
  p=r.data['part'];first=11 if advanced and p==4 else 3;second=25 if advanced and p in (3,5) else 17
  r.put(a+first,9,'K').block(a+13,8,2);t['nodes']=[node(a+(10 if advanced and p==5 else 7),9,1,'plate')]
  if advanced:
   r.put(a+second,9,'K');t['nodes'].append(node(a+(18 if p==5 else 21),9,2,'plate'))
   if p>=3:t['hint']={3:'El segundo guardián debe cargar hacia la izquierda: colócate al otro lado de su sello.',4:'El primer guardián mira desde la derecha; atrae su carga hacia la izquierda y cambia de lado para el segundo.',5:'Atrae las dos cargas hacia el centro. La columna separa a los guardianes y sirve de refugio.'}[p]
  r.platform(a+8,6,4).put(a+10,5,'$').platform(a+21,7,4)
 elif kind=='weight':
  if advanced:
   t['nodes']=[node(a+23,9,1,'stone'),node(a+3,3,2,'socket')]
   r.platform(a+18,8,5).platform(a+13,6,5).platform(a+8,4,5).platform(a+2,4,6)
   r.put(a+17,9,'r').put(a+14,5,'$');t['hint']='El peso está al fondo. Vuelve por la escalera superior hasta la balanza.'
  else:
   t['nodes']=[node(a+2,9,1,'stone'),node(a+23,6,2,'socket')]
   r.block(a+8,8,3).platform(a+14,7,4).platform(a+20,7,6)
   r.platform(a+9,5,4).put(a+10,4,'$')
 elif kind=='sequence':
  t['order']=['2','1','3'] if not advanced else (['4','2','1','3'] if r.data['part']>=4 else ['3','1','4','2'])
  t['nodes']=[node(a+2,9,1),node(a+13,6,2),node(a+23,9,3)]
  r.block(a+7,8,2).platform(a+11,7,6).put(a+15,6,'$')
  if advanced:
   r.put(a+20,4,'a').platform(a+5,4,5);t['nodes'].append(node(a+8,3,4))
 elif kind=='timed':
  t['order']=['1','2'];t['duration']=600 if not advanced else 420
  t['nodes']=[node(a+2,9,1),node(a+19,5,2)]
  r.platform(a+7,8,4,'_').platform(a+12,7,4).platform(a+17,6,5,'_')
  r.put(a+14,6,'$');r.data['hazards'].append(dict(kind='vent',col=a+10,row=9,width=2,period=230,warn=65,active=60,phase=a*13))
  if advanced:
   t['order'].append('3');t['nodes'].append(node(a+24,9,3));r.data['foes'].append(dict(kind='moth',col=a+23,row=3))
 else:
  t['nodes']=[node(a+1,9,'L','source',dir=1),node(a+8,9,'A','mirror'),node(a+8,4,'B','mirror'),node(a+23,4,'R','receiver')]
  r.platform(a+5,7,5).platform(a+6,5,7).put(a+12,4,'$')
  if advanced:
   t['nodes'][2]['angle']=1
   t['hint']='Sigue el haz de luz. Algunos espejos ya están bien orientados: gira solo los que desvían el camino al receptor.'
   t['nodes'][-1]=node(a+22,7,'R','receiver');t['nodes'].append(node(a+22,4,'C','mirror',angle=1))
   r.platform(a+19,5,6).platform(a+15,7,4)
 r.data['trials'].append(t)

def traversal(r,family,part):
 # A separate 26-column traversal separates the two puzzle chambers. Geometry,
 # threat height and recovery are authored per theme; every bank has a return.
 a=44
 if family==0:
  if part%2:
   r.pit(a+3,12).platform(a+4,8,4).platform(a+10,7,4).platform(a+16,8,4)
   r.put(a+11,6,'$');r.data['foes'].append(dict(kind='moth',col=a+15,row=3))
  else:r.block(a+4,8,3).platform(a+10,6,4).block(a+17,8,3).put(a+12,5,'a')
  r.data['foes'].append(dict(kind='beetle',col=a+23,row=9));r.put(a+20,9,'b')
 elif family==1:
  if part%2:
   r.pit(a+3,16).put(a+7,8,'-').platform(a+13,7,4,'_').platform(a+19,8,3)
  else:
   r.pit(a+4,18).put(a+5,7,'!').platform(a+8,3,6).platform(a+16,6,4,'_').platform(a+21,8,4)
  r.put(a+22,9,'b');r.put(a+2,5,'N')
  r.data['hazards'].append(dict(kind='pendulum',col=a+15,row=2,length=94,phase=part*39))
 elif family==2:
  r.block(a+3,8,2).put(a+9,9,'Y').block(a+15,7,2).platform(a+19,5,5)
  r.put(a+21,4,'$').put(a+23,9,'b')
  if part>=3:r.data['foes'].append(dict(kind='moth',col=a+21,row=2))
  else:r.put(a+20,9,'g')
 else:
  r.pit(a+3,13).platform(a+4,8,4,'_').platform(a+10,6,3).platform(a+15,8,4,'_')
  r.put(a+1,9,'f').put(a+22,9,'b');r.data['foes'].append(dict(kind='moth',col=a+17,row=3))
  if part>=3:r.put(a+24,9,'Y')

def service_gallery(r,family,part):
 # Mandatory inventory excursions use the original key/door rules. Each has a
 # different route: crypt staircase, clock lift, and a high fragile crossing.
 if family==0 and part==4:
  r.platform(73,8,4).platform(77,6,4).platform(81,4,4).platform(78,3,4)
  r.put(80,2,'k').put(77,4,'a');door=94
  hint='La llave está en la galería alta. Sube por los apoyos y vuelve a la compuerta de la derecha.'
  title='LA LLAVE DE LA GALERÍA ALTA'
 elif family==1 and part==2:
  r.platform(73,8,3).put(77,7,'!').platform(81,3,4).put(83,2,'k')
  r.platform(91,6,4).platform(97,8,3);door=102
  hint='El montacargas alcanza el balcón de la llave. Espera su subida, salta al balcón y baja hacia la compuerta.'
  title='LA LLAVE DEL MONTACARGAS'
 elif family==1 and part==4:
  r.platform(73,8,4).platform(77,8,4).platform(78,3,5).put(80,2,'k')
  r.pit(87,8).platform(88,5,3,'_').platform(93,7,3).platform(94,3,5)
  r.platform(102,6,4).platform(109,8,4);door=118
  r.data['hazards'].append(dict(kind='pendulum',col=90,row=1,length=70,phase=113))
  hint='Avanza hasta el balcón intermedio y salta hacia atrás para recoger la llave alta. Después cruza el péndulo hacia la compuerta; el apoyo bajo permite reintentar.'
  title='SUBE Y VUELVE A POR LA LLAVE'
 else:return
 for row in range(1,10):r.put(door,row,'D')
 r.data['service']=dict(start=70,door=door,title=title,hint=hint)

names=[
 ['EL PASEO DE LOS SELLOS','LA BALANZA ENTERRADA','LOS CANALES DEL GUARDIÁN','EL CLAUSTRO DE LAS RUNAS','EL TRIBUNAL DE BRONCE'],
 ['EL TALLER DEL ESCAPAMIENTO','LOS CONTRAPESOS GEMELOS','LA GALERÍA DEL PÉNDULO','LAS HORAS INVERTIDAS','LA GRAN SINFONÍA MECÁNICA'],
 ['EL ARCHIVO DE LOS ESPEJOS','LA BÓVEDA DE LAS CONSTELACIONES','LOS BALCONES DEL ECLIPSE','EL LABERINTO DE LOS RAYOS','LA ALINEACIÓN LUNAR'],
 ['LAS PUERTAS DEL SANTUARIO','LA FORJA DE LAS MEMORIAS','EL ACUEDUCTO DE LA SANGRE','LA GUARDIA DEL CREPÚSCULO','LOS TRES JURAMENTOS']]
themes=[['statues','court','sewer','crypt','statues'],['warehouse','attic','clocktower','bell','clocktower'],['archive','observatory','roof2','gallery','observatory'],['vault','heart','sewer','armory','heart']]
puzzles=[
 [('charge','sequence'),('weight','charge'),('charge','weight'),('sequence','charge'),('charge','weight')],
 [('timed','sequence'),('weight','timed'),('timed','weight'),('sequence','timed'),('timed','timed')],
 [('mirror','sequence'),('sequence','mirror'),('mirror','timed'),('timed','mirror'),('mirror','mirror')],
 [('charge','timed'),('sequence','weight'),('mirror','timed'),('weight','charge'),('sequence','mirror')]]
lessons={
 'charge':'Atráelo sobre el sello y salta su carga. Las columnas te protegen.',
 'weight':'Abajo toma el contrapeso: caminarás más lento. Usa los apoyos hasta el hueco.',
 'timed':'Activa los pulsadores numerados en orden con Abajo. Alcanza la puerta antes de que acabe el reloj.',
 'sequence':'Lee el orden de las runas. Abajo activa cada pedestal.',
 'mirror':'Abajo gira los espejos. Conecta la lámpara con el receptor.'}
levels=[]
for family in range(4):
 rooms=[]
 for p in range(1,6):
  width=112+(p-1)*8+(8 if family==3 else 0)
  if family==1 and p in (2,4):width+=24
  first,second=puzzles[family][p-1]
  r=Room(themes[family][p-1],names[family][p-1],width,lessons[first],p)
  trial(r,first,12,1,p>=3,family);traversal(r,family,p)
  # Later chambers move farther apart as traversal acquires a return or risk path.
  late=width-38
  if late>72:
   r.platform(69,7,5).put(71,6,'$')
   if late>=82:r.put(78,9,'w')
   if late>=90:r.platform(83,6,5).put(85,5,'$')
   if late>=98 and not (family==1 and p==4):r.data['hazards'].append(dict(kind='vent',col=94,row=9,width=2,period=220,warn=60,active=60,phase=p*27))
  service_gallery(r,family,p)
  trial(r,second,late,2,p>=2,family)
  # Safe utility and deliberately optional wealth, never a forced wait for length.
  r.put(9,5,'t').put(41,5,'t').put(width-9,5,'t')
  if family==3 and p==5:r.put(width-8,9,'C').put(width-6,9,'E')
  rooms.append(r.end(goal=p==5 and family!=3))
 if family==3:
  arena=Room('heart','EL CORAZÓN DEL BARÓN',20,'Dos niveles de refugio. Salta sobre el núcleo cuando se abra.',6)
  arena.grid[9][3]='.';arena.grid[9][7]='.'
  arena.platform(3,7,5).platform(4,5,4).platform(13,7,5).platform(14,5,4)
  arena.data['finalArena']=True
  arena.data['rows']=[''.join(row) for row in arena.grid];rooms.append(arena.data)
  vault=Room('vault','EL AMANECER LIBRE',14,'El corazón ya no late. Recoge el tesoro y sal del castillo.',6)
  vault.grid[9][3]='.';vault.grid[9][7]='.';rooms.append(vault.end(goal=True))
  for room in rooms:room['parts']=6
 title=['EL JARDÍN DE LAS ESTATUAS','LA TORRE DEL RELOJ','EL OBSERVATORIO DEL BARÓN','LA CÁMARA DEL CORAZÓN'][family]
 goal=['seal','gear','lens','heart'][family];segs=[]
 for i,room in enumerate(rooms):
  segs.append(room)
  if i<4:segs.append(dict(t=room['t'],label=room['label'],part=i+1,parts=room['parts'],transition=True,rows=['###']+['...']*9+['###','###']))
 levels.append(dict(name=title,goal=goal,goalName=['EL SELLO DE BRONCE','EL ENGRANAJE MAESTRO','LA LENTE LUNAR','EL CORAZÓN DEL CASTILLO'][family],song=['garden','castle','city','museum'][family],campaign=True,intro=[title,'','MOVER, SALTAR Y EXPLORAR.','ABAJO: USAR MECANISMOS.','P: CONSULTAR LA PISTA DE LA PARTE.','','LOS ENCHUFES RECARGAN AL TOCARLOS.'],segs=segs))

if __name__=='__main__':
 p=ROOT/'index.html';line_end='\r\n' if b'\r\n' in p.read_bytes() else '\n';s=p.read_text(encoding='utf-8');a=s.index('// EXPANSION_LAYOUTS_BEGIN');b=s.index('\n];\nfunction buildLevel',a)
 s=s[:a]+'// EXPANSION_LAYOUTS_BEGIN — generated by tools/build-campaign.py\n'+',\n'.join(json.dumps(d,ensure_ascii=False,indent=1) for d in levels)+'\n// EXPANSION_LAYOUTS_END'+s[b:]
 runtime=(ROOT/'tools/campaign-runtime.js').read_text(encoding='utf-8')
 if '// CAMPAIGN_RUNTIME_BEGIN' in s:a=s.index('// CAMPAIGN_RUNTIME_BEGIN');b=s.index('// CAMPAIGN_RUNTIME_END',a)+len('// CAMPAIGN_RUNTIME_END')
 else:a=b=s.index('// ---------------- Entrada ----------------')
 s=s[:a]+'// CAMPAIGN_RUNTIME_BEGIN\n'+runtime+'\n// CAMPAIGN_RUNTIME_END'+s[b:]
 p.write_text(s,encoding='utf-8',newline=line_end);print('Generated campaign: 20 authored parts, 40 puzzle gates, boss only in N8; N1–N4 map data preserved.')
