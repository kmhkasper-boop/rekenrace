#!/usr/bin/env python3
"""Zet Grogs art (/workspace/rekenrace_assets) om naar assets/*.webp met de namen die de game verwacht."""
import os, glob
from PIL import Image, ImageOps, ImageEnhance
SRC = '/workspace/rekenrace_assets'; OUT = os.path.join(os.path.dirname(__file__), '..', 'assets')
os.makedirs(OUT, exist_ok=True)
SEAS = ['lente', 'zomer', 'herfst', 'winter']
def save(im, name, maxw, maxh=None, q=80):
    im = im.copy(); im.thumbnail((maxw, maxh or maxw), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=q, method=6); return im.size
def op(p): return Image.open(os.path.join(SRC, p))
def trim(im, pad=6):
    bb = im.getchannel('A').point(lambda a: 255 if a > 16 else 0).getbbox()
    if not bb: return im
    l, t, r, b = bb; return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))
n = 0
for s in SEAS:
    save(op(f'achtergrond/bg_{s}_far_landschap.png').convert('RGB'), f'bg_{s}', 1280); n += 1
    save(op(f'achtergrond/bg_{s}_far_portret.png').convert('RGB'), f'bg_{s}_p', 720, 1280); n += 1
    save(trim(op(f'achtergrond/bg_{s}_mid_landschap.png').convert('RGBA'), 0), f'bg_{s}_mid', 1280); n += 1
    for i, f in enumerate(sorted(glob.glob(f'{SRC}/achtergrond/bg_{s}_near_0[0-9].png'))):
        save(trim(Image.open(f).convert('RGBA')), f'near_{s}_{i}', 256); n += 1
    save(op(f'wereldkaart/map_{s}.png').convert('RGB'), f'map_{s}', 720, 1280, 72); n += 1
ICON = ['tel_tuin', 'splits_sloot', 'bruggetje', 'klokkentoren', 'honderd_haven', 'tafelstrand', 'ijskraam', 'vulkaaneiland',
        'duizend_dennen', 'meetmoeras', 'nullen_heuvel', 'breukenbos', 'komma_kristal', 'procentenpiek', 'verhoudings_gletsjer', 'noorderlicht_finale']
for i, k in enumerate(ICON): save(op(f'wereldicoon/icon_{k}.png').convert('RGBA'), f'icon_w{i}', 160); n += 1
VEH = [['bliksem', 'lieveheer', 'bloembus', 'bij'], ['raceauto', 'ijscokar', 'surf', 'dino'], ['paddo', 'pompoen', 'eenhoorn', 'uilvlieger'], ['slee', 'ijsbeer', 'scooter', 'raket']]
for si, s in enumerate(SEAS):
    for j, vid in enumerate(VEH[si]):
        im = op(f'voertuig/vehicle_{s}_{j + 1}.png').convert('RGBA')
        if s == 'herfst' and j == 2:  # groen → grijs, dan lichter zodat multiply-tinten werkt
            a = im.getchannel('A'); g = ImageOps.grayscale(im.convert('RGB')); g = ImageEnhance.Brightness(ImageEnhance.Contrast(g).enhance(.9)).enhance(1.35)
            im = Image.merge('RGBA', (g, g, g, a))
        save(trim(im), f'veh_{vid}', 256, q=85); n += 1
CH = {'opa': 'opa_tandwiel', 'pim': 'pim_de_mol', 'chaos': 'graaf_chaos', 'kikker': 'kikkerkoning', 'victor': 'vulkaan_victor', 'uil': 'uil_komma', 'egel': 'egel_ridder', 'speler_a': 'speler_a', 'speler_b': 'speler_b', 'speler_c': 'speler_c'}
MOOD = {'blij': 0, 'verrast': 1, 'boos': 2}
for k, f in CH.items():
    for m, mi in MOOD.items():
        im = trim(op(f'personage/char_{f}_{m}.png').convert('RGBA'))
        if k == 'speler_b':  # hele figuur → buste (bovenste ~45%)
            im = trim(im.crop((0, 0, im.width, int(im.height * .47))), 2)
        save(im, f'char_{k}_{mi}', 320, q=82); n += 1
for k in ['gate_normaal', 'gate_goed', 'gate_fout', 'munt', 'ster', 'skip_voucher', 'logo_embleem', 'knop_breed', 'knop_rond', 'knop_vierkant'] + [f'kristal_{s}' for s in SEAS]:
    save(trim(op(f'ui/ui_{k}.png').convert('RGBA')), f'ui_{k}', 256, q=85); n += 1
save(op('ui/ui_garage_achtergrond.png').convert('RGB'), 'ui_garage', 720, 1280, 70); save(op('ui/ui_garage_achtergrond_landschap.png').convert('RGB'), 'ui_garage_l', 1280, 720, 70); n += 2
print(n, 'bestanden')
# ---- deel 6: rustmomenten (sheet 4 frames) ----
import json
for f in sorted(glob.glob(f'{SRC}/rustmoment/rust_0*_sheet.png')):
    k = os.path.basename(f).split('_')[1]  # 01..08
    save(Image.open(f).convert('RGBA'), f'rest_r{k}', 1536, 384, 80); n += 1
# ---- deel 7: verhaalstrips ----
B = json.load(open(f'{SRC}/verhaal/bubbles.json'))['strips']
for i in range(1, 17):
    save(op(f'verhaal/strip_{i:02d}_1280.png').convert('RGB'), f'strip_{i:02d}', 1280, 720, 76); n += 1
out = {k: {'p': [p['box'] for p in v['panels']], 'b': [[b['panel']] + b['box'] + [b['text']] for b in v['bubbles']], 'e': [[e['panel']] + e['box'] for e in v.get('empty_boxes', [])]} for k, v in B.items()}
open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'strips.js'), 'w').write('/* gegenereerd door tools/art.py uit Grogs bubbles.json: panelen [x,y,w,h], ballonnen [paneel,x,y,w,h,tekst], lege vlakken [paneel,x,y,w,h] (1792-breed) */\nconst STRIPS = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(n, 'bestanden (incl. deel 6-7)')
