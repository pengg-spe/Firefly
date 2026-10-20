import os, struct, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

MUSIC_DIR = r"D:\Firefly\public\assets\music"

def synchsafe(b):
    return (b[0]<<21)|(b[1]<<14)|(b[2]<<7)|b[3]

def decode_text(encoding, data):
    if encoding == 0: return data.decode('latin-1','replace')
    if encoding == 1: return data.decode('utf-16','replace')
    if encoding == 2: return data.decode('utf-16-be','replace')
    return data.decode('utf-8','replace')

def parse_frame_text(body, enc):
    # skip BOM if utf-16
    if enc in (1,2) and body[:2] in (b'\xff\xfe', b'\xfe\xff'):
        body = body[2:]
    return decode_text(enc, body).strip()

WANT = {'TIT2':'标题','TPE1':'歌手','TPE2':'专辑歌手','TALB':'专辑','TRCK':'曲目'}

def inspect(path):
    with open(path,'rb') as f: data=f.read()
    if data[:3]!=b'ID3': 
        print("  无ID3标签"); return
    ver=data[3]; flags=data[5]; size=synchsafe(data[6:10]); pos=10
    if flags&0x40:
        ext=synchsafe(data[10:14]) if ver>=4 else struct.unpack('>I',data[10:14])[0]
        pos=10+ext
    end=10+size
    found={}
    while pos+10<=end and pos+10<=len(data):
        if ver==2:
            fid=data[pos:pos+3].decode('latin-1','replace')
            fsize=struct.unpack('>I',b'\x00'+data[pos+3:pos+6])[0]; fpos=pos+6; fids=('TT2','TP1','TP2','TAL','TRK')
        else:
            fid=data[pos:pos+4].decode('latin-1','replace')
            fsize=synchsafe(data[pos+4:pos+8]) if ver==4 else struct.unpack('>I',data[pos+4:pos+8])[0]
            fpos=pos+10
            fids=('TIT2','TPE1','TPE2','TALB','TRCK')
        if fid in fids:
            body=data[fpos:fpos+fsize]
            if body:
                enc=body[0]; txt=parse_frame_text(body[1:],enc)
                found[fid]=txt
        if fsize<=0: break
        pos=fpos+fsize
    for k,v in WANT.items():
        if k in found:
            print(f"  {v}({k}): {found[k]}")
    if not found:
        print("  有ID3但无标题/歌手帧")

for name in ["一事无成.mp3","奇遇记.mp3"]:
    fp=os.path.join(MUSIC_DIR,name)
    print(f"\n===== {name} =====")
    inspect(fp)
