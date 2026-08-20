import os
import subprocess

svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <g fill="#000000">
    <!-- Left Bracket < -->
    <path d="M 172 72 L 52 195 C 48 199 48 201 52 205 L 172 328 C 176 332 184 329 186 323 C 188 316 182 309 176 303 L 88 200 L 176 97 C 182 91 188 84 186 77 C 184 71 176 68 172 72 Z" />

    <!-- Right Bracket > -->
    <path d="M 428 72 L 548 195 C 552 199 552 201 548 205 L 428 328 C 424 332 416 329 414 323 C 412 316 418 309 424 303 L 512 200 L 424 97 C 418 91 412 84 414 77 C 416 71 424 68 428 72 Z" />

    <!-- Flowing S Curve: Upper Swoop -->
    <path d="M 378 36 C 382 52 376 72 342 79 C 298 88 238 102 204 142 C 178 172 174 198 206 208 C 212 210 216 208 214 202 C 196 194 194 176 212 152 C 238 120 292 106 338 98 C 378 90 404 72 384 38 C 382 34 376 33 378 36 Z" />

    <!-- Flowing S Curve: Central Body & Lower Loop -->
    <path d="M 206 206 C 228 206 256 220 286 238 C 334 266 376 270 398 252 C 404 246 406 238 396 232 C 392 230 388 232 388 238 C 374 252 338 248 296 224 C 264 206 234 194 206 194 C 198 194 194 200 198 204 C 200 206 204 206 206 206 Z" />

    <!-- Flowing S Curve: Lower Swoop and Flourish Tail -->
    <path d="M 346 228 C 368 238 398 256 406 280 C 416 308 388 328 340 338 C 286 350 226 364 164 368 C 160 368 158 372 162 374 C 220 372 284 360 344 348 C 400 336 432 310 420 274 C 410 244 374 224 348 214 C 342 212 340 224 346 228 Z" />

    <!-- Classic Serif "K" -->
    <!-- Vertical Left Stem -->
    <path d="M 216 148 L 260 148 L 260 156 L 246 156 L 246 244 L 260 244 L 260 252 L 216 252 L 216 244 L 230 244 L 230 156 L 216 156 Z" />

    <!-- Top Diagonal Arm -->
    <path d="M 246 202 L 302 156 L 290 156 L 290 148 L 334 148 L 334 156 L 322 156 L 264 202 Z" />

    <!-- Bottom Diagonal Leg -->
    <path d="M 262 198 L 322 244 L 338 244 L 338 252 L 288 252 L 288 244 L 302 244 L 250 204 Z" />
  </g>
</svg>
'''

os.makedirs('./public', exist_ok=True)

with open('./public/logo.svg', 'w') as f:
    f.write(svg_content)

print("Created ./public/logo.svg")

# Render to PNGs
sizes = [
    (600, 400, './public/logo.png'),
    (192, 192, './public/favicon.png'),
    (180, 180, './public/apple-touch-icon.png'),
    (64, 64, './public/favicon-64.png'),
    (32, 32, './public/favicon-32.png')
]

for w, h, out in sizes:
    cmd = ['convert', '-background', 'none', '-size', f'{w}x{h}', './public/logo.svg', out]
    subprocess.run(cmd, check=True)
    print(f"Generated {out}")

# Also create favicon.ico from 32 & 64
subprocess.run(['convert', './public/favicon-32.png', './public/favicon.ico'], check=True)
print("Generated ./public/favicon.ico")
