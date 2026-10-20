import re, io, sys, shutil
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LRC = Path(r"D:\Firefly\public\assets\music\lrc")
BAK = LRC / "_shift_backup"
BAK.mkdir(exist_ok=True)
TS = re.compile(r"\[(\d+):(\d+)\.(\d+)\]")

def parse_ms(m):
    mm=int(m.group(1)); ss=int(m.group(2)); frac=m.group(3)
    return (mm*60+ss)*1000 + int((frac+"000")[:3])

def fmt(total, n):
    total=max(0,total)
    nm=total//60000; rem=total%60000; ns=rem//1000; nms=rem%1000
    f = f"{nms//100:01d}" if n==1 else (f"{nms//10:02d}" if n==2 else f"{nms:03d}")
    return f"[{nm:02d}:{ns:02d}.{f}]"

def shift_line(line, off_ms, anchor_ms=None):
    def repl(m):
        n=len(m.group(3)); t=parse_ms(m)
        if anchor_ms is not None and t < anchor_ms:
            return m.group(0)
        return fmt(t-off_ms, n)
    return TS.sub(repl, line)

# --- 正月里: 以首个“后知后觉”为锚点，其后统一再 -2s ---
p = LRC/"正月里.lrc"
bak = BAK/"正月里.lrc.pre_piecewise"
if not bak.exists(): shutil.copy2(p, bak)
lines = p.read_text(encoding="utf-8-sig").splitlines(keepends=True)
anchor=None
for l in lines:
    if "后知后觉" in l:
        m=TS.search(l)
        if m:
            t=parse_ms(m); anchor = t if anchor is None else min(anchor,t)
print("正月里 锚点(ms)=", anchor, "=>", f"{anchor//60000:02d}:{(anchor%60000)//1000:02d}.{anchor%1000:03d}")
new = [shift_line(l, 2000, anchor) for l in lines]
p.write_text("\ufeff"+"".join(new), encoding="utf-8")

# --- 爱的故事上集: 全局再 -2s（净 -4s） ---
p2 = LRC/"爱的故事上集.lrc"
bak2 = BAK/"爱的故事上集.lrc.pre_v2"
if not bak2.exists(): shutil.copy2(p2, bak2)
lines2 = p2.read_text(encoding="utf-8-sig").splitlines(keepends=True)
new2 = [shift_line(l, 2000) for l in lines2]
p2.write_text("\ufeff"+"".join(new2), encoding="utf-8")
print("正月里 与 爱的故事上集 处理完成")
