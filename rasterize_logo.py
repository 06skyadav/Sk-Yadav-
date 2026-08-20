import zlib
import struct
import math

def make_png(width, height, rgba_data):
    # rgba_data is bytes of length width * height * 4
    raw_rows = bytearray()
    for y in range(height):
        raw_rows.append(0) # filter byte 0 (None)
        start = y * width * 4
        raw_rows.extend(rgba_data[start:start + width * 4])
    
    compressed = zlib.compress(bytes(raw_rows), 9)
    
    def chunk(tag, data):
        c = bytearray()
        c.extend(tag)
        c.extend(data)
        crc = zlib.crc32(c)
        return struct.pack('>I', len(data)) + bytes(c) + struct.pack('>I', crc)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    # IHDR
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b'IHDR', ihdr))
    # IDAT
    png.extend(chunk(b'IDAT', compressed))
    # IEND
    png.extend(chunk(b'IEND', b''))
    return bytes(png)

print("PNG helper ready")
