import os, glob, struct

MUSIC_DIR = r"D:\Firefly\public\assets\music"

def synchsafe(b):
    return (b[0]<<21)|(b[1]<<14)|(b[2]<<7)|b[3]

def decode_text(encoding, data):
    # encoding: 0 latin1, 1 utf-16(BOM), 2 utf-16be, 3 utf-8
    if encoding == 0:
        return data.decode('latin-1', errors='replace')
    elif encoding == 1:
        return data.decode('utf-16', errors='replace')
    elif encoding == 2:
        return data.decode('utf-16-be', errors='replace')
    elif encoding == 3:
        return data.decode('utf-8', errors='replace')
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
    if flags & 0x40:  # extended header
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
            if ver_major == 4:
                fsize = synchsafe(data[pos+4:pos+8])
            else:
                fsize = struct.unpack('>I', data[pos+4:pos+8])[0]
            fpos = pos + 10
            id_lyrics = ('USLT',)
        if fid in id_lyrics:
            body = data[fpos:fpos+fsize]
            if not body:
                pos = fpos + fsize
                continue
            enc = body[0]
            # language 3 bytes then descriptor null-term then text
            rest = body[1:]
            if enc in (1,2):
                # utf-16: find null terminator (2 bytes 00 00)
                idx = rest.find(b'\x00\x00')
                if idx == -1:
                    text = rest
                else:
                    text = rest[idx+2:]
            else:
                idx = rest.find(b'\x00')
                if idx == -1:
                    text = rest
                else:
                    text = rest[idx+1:]
            lyrics = decode_text(enc, text).strip()
            return lyrics
        if fsize <= 0:
            break
        pos = fpos + fsize
    return None

files = sorted(glob.glob(os.path.join(MUSIC_DIR, "*.mp3")))
print(f"扫描到 {len(files)} 个 mp3\n")
for fp in files:
    base = os.path.splitext(os.path.basename(fp))[0]
    lyr = extract_uslt(fp)
    if lyr:
        has_ts = '[' in lyr and any(c.isdigit() for c in lyr.split('[')[1].split(']')[0]) if '[' in lyr else False
        print(f"[有歌词] {base}  字符数={len(lyr)}  含时间轴={'是' if has_ts else '否'}")
        print("        首行:", lyr.splitlines()[0][:60] if lyr.splitlines() else "")
    else:
        print(f"[无歌词] {base}")
