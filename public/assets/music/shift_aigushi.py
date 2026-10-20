import re, io, sys, shutil
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LRC = Path(r"D:\Firefly\public\assets\music\lrc")
BAK = LRC / "_shift_backup"; BAK.mkdir(exist_ok=True)
TS = re.compile(r"\[(\d+):(\d+)\.(\d+)\]")

def parse_ms(m):
    mm=int(m.group(1)); ss=int(m.group(2)); frac=m.group(3)
    return (mm*60+ss)*1000 + int((frac+"000")[:3])

def fmt(total, n):
    total=max(0,total)
    nm=total//60000; rem=total%60000; ns=rem//1000; nms=rem%1000
    f = f"{nms//100:01d}" if n==1 else (f"{nms//10:02d}" if n==2 else f"{nms:03d}")
    return f"[{nm:02d}:{ns:02d}.{f}]"

def shift_line(line, off_ms):
    return TS.sub(lambda m: fmt(parse_ms(m)-off_ms, len(m.group(3))), line)

p = LRC/"爱的故事上集.lrc"
bak = BAK/"爱的故事上集.lrc.pre_v3"
if not bak.exists(): shutil.copy2(p, bak)
lines = p.read_text(encoding="utf-8-sig").splitlines(keepends=True)
new = [shift_line(l, 1500) for l in lines]
p.write_text("\ufeff"+"".join(new), encoding="utf-8")
print("爱的故事上集 再提前1.5秒完成，净偏移 -5.5s")
