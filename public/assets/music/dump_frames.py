import os, struct, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
MUSIC_DIR = r"D:\Firefly\public\assets\music"
def synchsafe(b): return (b[0]<<21)|(b[1]<<14)|(b[2]<<7)|b[3]
def dec(enc, d):
    if enc==0: return d.decode('latin-1','replace')
    if enc==1: return d.decode('utf-16','replace')
    if enc==2: return d.decode('utf-16-be','replace')
    return d.decode('utf-8','replace')
def inspect(path):
    data=open(path,'rb').read()
    if data[:3]!=b'ID3': print("  无ID3"); return
    ver=data[3]; flags=data[5]; size=synchsafe(data[6:10]); pos=10
    if flags&0x40:
        ext=synchsafe(data[10:14]) if ver>=4 else struct.unpack('>I',data[10:14])[0]; pos=10+ext
    end=10+size
    while pos+10<=end and pos+10<=len(data):
        if ver==2:
            fid=data[pos:pos+3].decode('latin-1','replace'); fsize=struct.unpack('>I',b'\x00'+data[pos+3:pos+6])[0]; fpos=pos+6
        else:
            fid=data[pos:pos+4].decode('latin-1','replace'); fsize=synchsafe(data[pos+4:pos+8]) if ver==4 else struct.unpack('>I',data[pos+4:pos+8])[0]; fpos=pos+10
        body=data[fpos:fpos+fsize]
        preview=''
        if body:
            enc=body[0]; txt=dec(enc, body[1:min(60,len(body))])
            preview=txt
        print(f"  [{fid}] size={fsize}  {preview!r}")
        if fsize<=0: break
        pos=fpos+fsize
print("===== 奇遇记.mp3 全部帧 =====")
inspect(os.path.join(MUSIC_DIR,"奇遇记.mp3"))
