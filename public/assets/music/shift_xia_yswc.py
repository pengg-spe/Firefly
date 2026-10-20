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

jobs = {
    "下山.lrc": 1000,        # 提前1秒
    "一事无成.lrc": 1500,    # 提前1.5秒
}
for name, off in jobs.items():
    p = LRC/name
    bak = BAK/f"{name}.pre_userdl"
    if not bak.exists(): shutil.copy2(p, bak)
    lines = p.read_text(encoding="utf-8-sig").splitlines(keepends=True)
    new = [shift_line(l, off) for l in lines]
    p.write_text("\ufeff"+"".join(new), encoding="utf-8")
    print(f"{name} 提前 {off/1000}s 完成")
