"""Deterministic crops/compression of user-supplied originals; no generated imagery."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
source = Path('/Users/stella/Desktop/Cora网站素材')
out = Path(__file__).resolve().parent.parent / 'public/images'
out.mkdir(parents=True, exist_ok=True)
def webp(path, name, width=1600, box=None):
    im=Image.open(source/path).convert('RGB')
    if box: im=im.crop(box)
    im.thumbnail((width,width))
    im.save(out/name,'WEBP',quality=87,method=6)
# Trace follows the supplied render's actual silhouette, retaining original pixels.
im=Image.open(source/'模型/产品图.png').convert('RGBA')
points=[(630,727),(647,688),(646,363),(635,345),(640,305),(658,277),(684,268),(830,110),(831,87),(850,64),(880,46),(920,51),(937,73),(1362,141),(1376,125),(1423,131),(1445,150),(1462,187),(1460,219),(1448,234),(1484,547),(1507,587),(1498,623),(1471,657),(1376,746),(1271,823),(1233,838),(1205,837),(1178,848),(1153,846),(1124,829),(726,798),(704,804),(671,799),(649,776)]
mask=Image.new('L',im.size,0); ImageDraw.Draw(mask).polygon(points,fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(.65)); im.putalpha(mask)
im=im.crop((605,26,1528,868)); im.save(out/'cora-hero.webp','WEBP',quality=93,method=6)
# Use the orthographic sheet, with its labels removed, as six honest 2D views.
boxes=[(36,42,428,402),(442,42,830,402),(849,42,1241,402),(1245,42,1640,402),(383,459,786,857),(892,459,1294,857)]
for name,box in zip(['front','left','rear','right','top','bottom'],boxes):
    webp(Path('模型/产品6面 展示图.png'),f'cora-{name}.webp',800,box)
webp(Path('模型/产品图.png'),'cora-original.webp')
webp(Path('模型/产品6面 展示图.png'),'cora-six-views.webp')
webp(Path('团队照片/天巡者-合照.png'),'team.webp',1600)
webp(Path('背景/ISS图片.jpg'),'iss-orbit.webp',1800)
webp(Path('背景/ISS.jpeg'),'earth-mission.webp',1200)
webp(Path('背景/ISS内部.jpeg'),'station-interior.webp',1400)
for name,file in [('cargo','带锁扣的小型载物盒.png'),('temperature','温度传感器模块.png'),('arm','小型机械臂.png'),('pump','小型泵阀模块.png')]:
    webp(Path('多模块')/file,f'module-{name}.webp',1200)
for name,file in [('inspection','cora 场景图4.png'),('environment','cora场景图3.png'),('inventory','cora场景图2.png'),('assistance','cora场景图.png')]:
    webp(Path('场景')/file,f'scene-{name}.webp',1600)
logo=Image.open(source/'logo/公司logo.png').convert('RGBA')
print('Logo original corner / center:',logo.getpixel((0,0)),logo.getpixel((600,450)))
# Select the primary, supplied logo lockup rather than redrawing the brand.
logo=logo.crop((185,237,1370,617)); logo.thumbnail((570,190));logo.save(out/'aster-logo.png')
Image.open(source/'logo/公司logo.png').crop((194,242,565,610)).resize((96,96)).save(out/'aster-mark.png')
print('Prepared',len(list(out.iterdir())),'assets')
