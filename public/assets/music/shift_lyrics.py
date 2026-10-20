import os, re, shutil, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

LRC = r"D:\Firefly\public\assets\music\lrc"
BAK = os.path.join(LRC, "_shift_backup")

# filename -> shift seconds (positive = "提前" = subtract from timestamps)
SHIFTS = {
    "奇遇记.lrc": 1.5,
    "At-Least-I-Had-Fun.lrc": 0.5,
    "Eenie-Meenie.lrc": 1.0,
    "Fences.lrc": 1.0,
    "Hello-Summer.lrc": 1.5,
    "Love-To-Lose.lrc": 1.5,
    "No-Rest.lrc": 1.0,
    "One-Time.lrc": 1.5,
    "Something-Strange.lrc": 1.5,
    "Take-A-Bow.lrc": 0.5,
    "The-Cure.lrc": 1.5,
    "U-Make-Me-Wanna.lrc": 1.5,
    "Wish-You-Were-Here.lrc": 1.5,
    "啷个哩个啷.lrc": 1.5,
    "如果当时.lrc": 1.5,
    "我们-(feat.-李杰明).lrc": 1.5,
    "我本将心向明月.lrc": 0.5,
    "正月里.lrc": 2.0,
    "爱的故事上集.lrc": 2.0,
    "能不能回到小时候.lrc": 1.5,
    "香草把噗.lrc": 1.0,
    "죽을-만큼-아파서-(死一样的痛苦).lrc": 8.0,
}

TS = re.compile(r"\[(\d+):(\d+)\.(\d+)\]")

def shift_token(m, off_ms, nfrac):
    mm = int(m.group(1)); ss = int(m.group(2)); frac = m.group(3)
    # original total ms (pad/truncate frac to 3 digits)
    ms3 = int((frac + "000")[:3])
    total = (mm * 60 + ss) * 1000 + ms3
    total = max(0, total - off_ms)
    nm = total // 60000
    rem = total % 60000
    ns = rem // 1000
    nms = rem % 1000
    if nfrac == 1:
        f = f"{nms // 100}"
    elif nfrac == 2:
        f = f"{nms // 10:02d}"
    else:
        f = f"{nms:03d}"
    return f"[{nm:02d}:{ns:02d}.{f}]"

def shift_line(line, off_ms):
    def repl(m):
        nfrac = len(m.group(3))
        return shift_token(m, off_ms, nfrac)
    return TS.sub(repl, line)

os.makedirs(BAK, exist_ok=True)
for name, sec in SHIFTS.items():
    src = os.path.join(LRC, name)
    if not os.path.isfile(src):
        print(f"[跳过] 找不到 {name}")
        continue
    # backup once
    dst_bak = os.path.join(BAK, name)
    if not os.path.isfile(dst_bak):
        shutil.copy2(src, dst_bak)
    with open(src, "r", encoding="utf-8-sig") as f:
        lines = f.readlines()
    off_ms = int(round(sec * 1000))
    new_lines = [shift_line(l, off_ms) for l in lines]
    with open(src, "w", encoding="utf-8") as f:  # write with BOM for consistency
        f.write("\ufeff")
        f.writelines(new_lines)
    print(f"[完成] {name}  提前 {sec}s  (行数 {len(lines)})")
print("\n备份目录:", BAK)
print("如需回退: 从 _shift_backup/ 复制对应文件覆盖回 lrc/ 即可")
