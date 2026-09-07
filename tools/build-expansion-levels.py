"""Authored layouts for N5–N8. Rebuild only the marked expansion in index.html.
Coordinates are tiles; all stamps reject accidental overwrites of gameplay objects.
No random generation, external dependencies or runtime build step.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
class Room:
    def __init__(self, theme, label, width, lesson, rank, first=False):
        self.data = dict(t=theme, label=label, lesson=lesson, pressure=rank)
        self.w=width
        self.grid=[list('.'*width) for _ in range(12)]
        for r in (0,10,11): self.grid[r]=list('#'*width)
        self.put(3,9,'P' if first else 'C')
        self.put(7,9,'E')
    def put(self,x,y,s):
        assert 0<=x and x+len(s)<=self.w and 0<=y<12
        for i,c in enumerate(s):
            old=self.grid[y][x+i]
            assert old in '.#~' or old==c, (self.data['label'],x+i,y,old,c)
            self.grid[y][x+i]=c
        return self
    def platform(self,x,y,w,kind='='):return self.put(x,y,kind*w)
    def block(self,x,top,w):
        for r in range(top,10):self.put(x,r,'#'*w)
        return self
    def hanging_wall(self,x,bottom):
        for row in range(1,bottom+1):self.put(x,row,'#')
        return self
    def pit(self,x,w):
        for r in (10,11):self.put(x,r,'~'*w)
        return self
    def end(self,key=None,goal=None):
        if key:self.put(*key,'k')
        if goal:self.put(*goal,'S')
        self.put(self.w-3,9,'b')
        self.data['rows']=[''.join(r) for r in self.grid]
        return self.data

levels=[]
def assemble(name,goal,goalname,song,intro,rooms,done=None):
    segs=[]
    for n,r in enumerate(rooms):
        r['part']=n+1;r['parts']=len(rooms);segs.append(r)
        if n<len(rooms)-1:
            segs.append(dict(t=r['t'],label=r['label'],part=n+1,parts=len(rooms),transition=True,
                rows=['###','.#.','.#.','.#.','.#.','.#.','.#.','t#t','.D.','.D.','###','###']))
    d=dict(name=name,goal=goal,goalName=goalname,song=song,intro=intro,segs=segs)
    if done:d['done']=done
    levels.append(d)

# N5: read a charge, cross separated patrols, learn water crossings, then combine.
r=Room('statues','EL PASEO OLVIDADO',40,'Espera el aviso del centinela; salta su carga.',3,True)
r.put(9,9,'A').block(16,8,2).platform(21,7,5).put(23,9,'K').platform(30,7,6).put(32,4,'$').platform(30,5,5)
r.put(12,9,'$');a=r.end(key=(33,6))
r=Room('court','EL PATIO DE PIEDRA',48,'Dos guardianes, dos refugios. Resuelve uno cada vez.',4)
r.block(12,8,3).block(25,7,3).block(37,8,3).put(20,9,'K').put(33,9,'K')
r.put(13,7,'$').put(26,6,'$').platform(40,6,5);b=r.end(key=(42,5))
r=Room('sewer','LOS CANALES VERDES',44,'Dos charcas y una isla para recuperar el salto.',5)
r.pit(12,8).pit(26,8).platform(14,8,4).platform(28,8,4).platform(35,7,6)
r.put(16,7,'$').put(23,9,'$').put(29,7,'$');c=r.end(key=(38,6))
r=Room('crypt','EL CLAUSTRO HUNDIDO',56,'Cruza el canal. Sube por la derecha y vuelve a la llave.',6)
r.block(13,8,2).put(21,9,'K').platform(22,7,5).pit(31,10).platform(33,8,4).platform(39,7,4)
r.block(46,8,2).put(50,9,'K').platform(48,6,6).platform(42,4,4,'#')
r.hanging_wall(41,4)
r.put(24,6,'$').put(34,7,'$').put(51,5,'$');d=r.end(key=(43,3))
r=Room('statues','EL ALTAR DE BRONCE',56,'Mide los saltos. Desde el balcón derecho vuelve al sello.',7)
r.block(13,8,2).put(20,9,'K').platform(19,7,5).pit(27,18)
r.platform(28,8,4).platform(34,7,4).platform(40,6,4).platform(46,5,6).platform(39,3,4,'#')
r.hanging_wall(38,3)
r.platform(47,8,3)  # Recovery from the dry floor below the return balcony.
r.put(29,7,'$').put(36,6,'$').put(49,4,'$');e=r.end(goal=(41,2))
assemble('EL JARDÍN DE LAS ESTATUAS','seal','EL SELLO DE BRONCE','garden',
 ['CINCO PASOS HASTA EL SELLO DE BRONCE.','PASEO, PATIO, CANALES, CLAUSTRO Y ALTAR.','','LEE LA CARGA DE LOS CENTINELAS.','USA LOS REFUGIOS Y CRUZA LAS CHARCAS.'],[a,b,c,d,e])

# N6: safe crumble trial -> required bridge -> required elevator -> timing -> exam.
r=Room('warehouse','EL TALLER DEL RELOJ',40,'Las tablas vibran antes de caer. Practica sobre suelo seguro.',4,True)
r.platform(11,7,4).platform(17,5,5,'_').platform(24,4,5).put(12,6,'$').put(19,4,'$')
r.put(32,9,'o');a=r.end(key=(26,3))
r=Room('clocktower','EL PUENTE DEL PÉNDULO',48,'Cruza las tablas frágiles; descansa en el apoyo central.',5)
r.pit(12,22).platform(13,8,4,'_').platform(19,7,3).platform(24,8,4,'_').platform(30,7,4,'_').platform(36,6,5)
r.put(15,7,'$').put(20,6,'$').put(32,6,'$');b=r.end(key=(39,5))
r=Room('attic','EL POZO DE PESAS',48,'Sube a la llave. Baja por las tablas hasta el apoyo de piedra.',6)
r.put(17,7,'!').platform(19,3,7).put(21,2,'$').pit(27,11)
r.platform(27,5,3,'_').platform(32,7,3).platform(38,6,5).platform(40,8,3).put(40,5,'$');c=r.end(key=(24,2))
r=Room('bell','LAS CAMPANAS ROTAS',56,'Espera el puente móvil antes de pisar las tablas.',7)
r.pit(12,30).put(17,8,'-').platform(24,7,4,'_').platform(30,6,4).platform(36,7,4,'_').platform(43,6,5)
r.put(26,6,'$').put(32,5,'$').put(45,5,'$');d=r.end(key=(46,5))
r=Room('clocktower','LA MAQUINARIA MAYOR',56,'Ascensor, balcón y puente frágil: mantén el ritmo.',8)
r.put(15,7,'!').platform(18,3,5).pit(23,22).platform(25,5,3,'_').platform(31,6,4).platform(37,5,4,'_').platform(44,4,7)
r.platform(46,8,3).platform(48,6,4)
r.put(20,2,'$').put(27,4,'$').put(33,5,'$');e=r.end(goal=(48,3))
assemble('LA TORRE DEL RELOJ','gear','EL ENGRANAJE MAESTRO','castle',
 ['DEL TALLER A LA MAQUINARIA MAYOR.','CADA MECANISMO PREPARA EL SIGUIENTE.','','LAS TABLAS AVISAN ANTES DE ROMPERSE.','ESPERA EN PIEDRA; SALTA EN MOVIMIENTO.'],[a,b,c,d,e])

# N7: safe cover -> advancing cover -> vertical targeting -> crossing -> exam.
r=Room('archive','EL ARCHIVO ESTELAR',40,'Usa la columna. Sube por la derecha y vuelve a la llave.',5,True)
r.block(14,8,2).put(23,9,'Y').block(29,8,2).platform(32,7,5).platform(26,4,5,'#')
r.hanging_wall(25,6)
r.put(15,7,'$').put(34,6,'$');a=r.end(key=(28,3))
r=Room('observatory','LA GALERÍA DE LOS RAYOS',48,'Avanza de columna en columna cuando pase el orbe.',6)
r.block(12,8,2).put(20,9,'Y').block(25,8,2).put(34,9,'Y').block(39,8,2).platform(40,6,5)
r.put(13,7,'$').put(26,7,'$').put(42,5,'$');b=r.end(key=(43,5))
r=Room('roof2','LAS TERRAZAS LUNARES',48,'Gana altura y usa los muros como cobertura vertical.',7)
r.block(13,8,2).platform(17,6,5).put(20,5,'Y').block(26,7,2).platform(30,4,5).put(32,3,'Y')
r.platform(37,6,5).put(18,5,'$').put(38,5,'$');c=r.end(key=(34,3))
r=Room('gallery','EL PASO DE LAS ÓRBITAS',56,'Resuelve al vigía desde el refugio y cruza el puente.',8)
r.block(12,8,2).put(21,9,'Y').block(26,8,2).pit(29,15).platform(30,8,4,'_').platform(36,7,3).platform(41,8,3,'_')
r.platform(46,6,7).put(32,7,'$').put(37,6,'$').put(50,5,'$');d=r.end(key=(51,5))
r=Room('observatory','LA CÚPULA DE LA LENTE',60,'Cruza entre disparos. Desde la derecha vuelve a la lente elevada.',9)
r.block(12,8,2).put(20,9,'Y').block(26,8,2).platform(29,6,5).put(32,5,'Y').block(37,7,2)
r.pit(29,8).pit(40,12).platform(41,7,3,'_').platform(44,8,2).platform(47,6,5,'_').platform(53,5,5).platform(45,3,4,'#')
r.hanging_wall(44,4)
r.platform(54,8,3)
r.put(13,7,'$').put(30,5,'$').put(55,4,'$');e=r.end(goal=(46,2))
assemble('EL OBSERVATORIO DEL BARÓN','lens','LA LENTE LUNAR','city',
 ['DEL ARCHIVO ESTELAR A LA CÚPULA.','CINCO PARTES GUARDAN LA LENTE LUNAR.','','LOS MUROS DETIENEN LOS ORBES.','ESPERA EL DISPARO Y CAMBIA DE ALTURA.'],[a,b,c,d,e])

# N8: known skills in pairs, safe recharge before the continuous final synthesis.
r=Room('vault','EL UMBRAL DEL SANTUARIO',44,'Alterna la carga de piedra y el tiro espectral.',6,True)
r.block(12,8,2).put(20,9,'K').block(26,8,2).put(33,9,'Y').platform(35,6,6)
r.put(13,7,'$').put(38,5,'$');a=r.end(key=(39,5))
r=Room('heart','LAS FORJAS DEL BARÓN',52,'Cruza el fuego y las tablas; recupera el salto en piedra.',7)
r.put(14,9,'f').platform(12,7,5).pit(21,16).platform(22,8,4,'_').platform(28,7,3).platform(33,8,4,'_')
r.put(43,9,'u').platform(40,6,7).put(14,6,'$').put(29,6,'$');b=r.end(key=(45,5))
r=Room('sewer','EL ACUEDUCTO SELLADO',48,'Recarga y cruza la sucesión de apoyos antes de la guardia.',8)
r.pit(12,25).put(16,8,'-').platform(23,7,3,'_').platform(29,6,3).platform(35,7,3,'_').platform(40,5,6)
r.put(25,6,'$').put(31,5,'$');c=r.end(key=(43,4))
r=Room('armory','LA GUARDIA DEL NÚCLEO',68,'Usa la cobertura. Del ascensor pasa a las tablas y a la llave.',9)
r.block(12,8,2).put(20,9,'K').block(27,8,2).put(35,9,'Y').block(41,8,2)
r.put(47,7,'!').platform(49,3,7).pit(52,10).platform(57,5,3,'_').platform(63,5,5)
r.platform(64,8,3)
r.put(13,7,'$').put(28,7,'$').put(51,2,'$');d=r.end(key=(65,4))
r=Room('heart','EL CORAZÓN DEL CASTILLO',76,'Cambia de altura ante el vigía, supera la carga y cruza al corazón.',10)
r.block(14,8,2).put(22,9,'Y').block(29,7,3).put(38,9,'K').block(44,8,2)
r.put(50,7,'!').platform(52,3,4).pit(52,18).platform(58,5,3,'_').platform(64,6,3,'_').platform(70,5,6)
r.platform(71,8,3)
r.put(15,7,'$').put(30,6,'$').put(54,2,'$').put(59,4,'$');e=r.end(goal=(73,4))
assemble('LA CÁMARA DEL CORAZÓN','heart','EL CORAZÓN DEL CASTILLO','museum',
 ['EL ÚLTIMO CAMINO UNE TODO LO APRENDIDO.','UMBRAL, FORJAS, ACUEDUCTO Y GUARDIA.','','RECARGA ANTES DE ENTRAR EN CADA RETO.','EL CORAZÓN ESPERA TRAS LA PRUEBA FINAL.'],[a,b,c,d,e],
 '¡HAS VENCIDO LA MANSIÓN Y SUS SECRETOS!')

if __name__=='__main__':
    p=ROOT/'index.html';s=p.read_text(encoding='utf-8')
    start=s.index("{name:'EL JARDÍN DE LAS ESTATUAS'") if '// EXPANSION_LAYOUTS_BEGIN' not in s else s.index('// EXPANSION_LAYOUTS_BEGIN')
    end=s.index('\n];\nfunction buildLevel',start)
    content='// EXPANSION_LAYOUTS_BEGIN — generated by tools/build-expansion-levels.py\n'+',\n'.join(json.dumps(d,ensure_ascii=False,indent=1) for d in levels)+'\n// EXPANSION_LAYOUTS_END'
    p.write_text(s[:start]+content+s[end:],encoding='utf-8')
    print('Authored 20 distinct parts, 16 locked transitions; originals untouched.')
