import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

MUSIC_DIR = r"D:\Firefly\public\assets\music"
sys.path.insert(0, MUSIC_DIR)
from scan_lyrics import extract_uslt
import os, glob

targets = sys.argv[1:] or [os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(MUSIC_DIR,"*.mp3"))]
for t in targets:
    fp = os.path.join(MUSIC_DIR, t + ".mp3")
    if not os.path.exists(fp):
        print(f"### {t}: 文件不存在"); continue
    lyr = extract_uslt(fp)
    print(f"\n========== {t} ==========")
    if not lyr:
        print("(无内嵌歌词)")
    else:
        print(lyr)
