import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path

PATH = Path(r"D:\Firefly\public\assets\music\lrc\正月里.lrc")
OFF = 1.5  # 提前 1.5 秒
TS = re.compile(r"\[(\d+):(\d+)\.(\d+)\]")

def repl(m, off_ms):
    mm = int(m.group(1)); ss = int(m.group(2)); frac = m.group(3)
    n = len(frac)
    ms = int((frac + "000")[:3])
    total = max(0, (mm*60 + ss)*1000 + ms - off_ms)
    nm = total // 60000; rem = total % 60000
    ns = rem // 1000; nms = rem % 1000
    f = f"{nms//100:01d}" if n == 1 else (f"{nms//10:02d}" if n == 2 else f"{nms:03d}")
    return f"[{nm:02d}:{ns:02d}.{f}]"

lines = PATH.read_text(encoding="utf-8-sig").splitlines(keepends=True)
new = [TS.sub(lambda m: repl(m, int(round(OFF*1000))), l) for l in lines]
PATH.write_text("\ufeff" + "".join(new), encoding="utf-8")
print("已对 正月里.lrc 提前 1.5 秒，行数:", len(lines))
