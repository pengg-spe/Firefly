import os, glob, struct, io, sys

MUSIC_DIR = r"D:\Firefly\public\assets\music"
LRC_DIR = os.path.join(MUSIC_DIR, "lrc")
os.makedirs(LRC_DIR, exist_ok=True)

# 已有精修版、不要被内嵌原始版覆盖
SKIP = {"八千里路明月照"}

def synchsafe(b):
    return (b[0]<<21)|(b[1]<<14)|(b[2]<<7)|b[3]

def decode_text(encoding, data):
    if encoding == 0:
        return data.decode('latin-1', errors='replace')
    elif encoding == 1:
        return data.decode('utf-16', errors='replace')
    elif encoding == 2:
        return data.decode('utf-16-be', errors='replace')
    else:
        return data.decode('utf-8', errors='replace')

def extract_uslt(path):
    with open(path, 'rb') as f:
        data = f.read()
    if data[:3] != b'ID3':
        return None
    ver_major = data[3]
    flags = data[5]
    size = synchsafe(data[6:10])
    pos = 10
    if flags & 0x40:
        ext_size = synchsafe(data[10:14]) if ver_major>=4 else struct.unpack('>I', data[10:14])[0]
        pos = 10 + ext_size
    end = 10 + size
    while pos + 10 <= end and pos + 10 <= len(data):
        if ver_major == 2:
            fid = data[pos:pos+3].decode('latin-1', 'replace')
            fsize = struct.unpack('>I', b'\x00'+data[pos+3:pos+6])[0]
            fpos = pos + 6
            id_lyrics = ('ULT',)
        else:
            fid = data[pos:pos+4].decode('latin-1', 'replace')
            fsize = synchsafe(data[pos+4:pos+8]) if ver_major==4 else struct.unpack('>I', data[pos+4:pos+8])[0]
            fpos = pos + 10
            id_lyrics = ('USLT',)
        if fid in id_lyrics:
            body = data[fpos:fpos+fsize]
            if not body:
                pos = fpos + fsize; continue
            enc = body[0]
            rest = body[1:]
            if enc in (1,2):
                idx = rest.find(b'\x00\x00')
                text = rest[idx+2:] if idx != -1 else rest
            else:
                idx = rest.find(b'\x00')
                text = rest[idx+1:] if idx != -1 else rest
            return decode_text(enc, text).strip()
        if fsize <= 0:
            break
        pos = fpos + fsize
    return None

def has_timestamps(lyr):
    for line in lyr.splitlines():
        s = line.strip()
        if s.startswith('[') and len(s) > 1:
            inner = s[1:].split(']')[0]
            if ':' in inner and any(c.isdigit() for c in inner):
                return True
    return False

files = sorted(glob.glob(os.path.join(MUSIC_DIR, "*.mp3")))
generated, skipped, missing = [], [], []
for fp in files:
    base = os.path.splitext(os.path.basename(fp))[0]
    if base in SKIP:
        skipped.append((base, "已有精修版，跳过"))
        continue
    lyr = extract_uslt(fp)
    if not lyr:
        missing.append(base)
        continue
    out = os.path.join(LRC_DIR, base + ".lrc")
    with open(out, 'w', encoding='utf-8-sig') as f:
        f.write(lyr + "\n")
    generated.append((base, len(lyr), "带时间轴" if has_timestamps(lyr) else "纯文本"))

print(f"共扫描 {len(files)} 个 mp3")
print(f"已生成 {len(generated)} 个 .lrc 文件：")
for b, n, t in generated:
    print(f"  [OK] {b}.lrc  ({n}字符, {t})")
print(f"\n跳过 {len(skipped)} 个：")
for b, r in skipped:
    print(f"  [SKIP] {b}.lrc  ({r})")
print(f"\n缺失内嵌歌词 {len(missing)} 个（无法生成）：")
for b in missing:
    print(f"  [MISS] {b}")
