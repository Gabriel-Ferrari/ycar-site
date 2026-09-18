#!/usr/bin/env python3
"""
Gera as variantes responsivas consumidas por `srcsetCard()` em site-content.ts.

Rode sempre que adicionar ou trocar uma foto em public/images/{servicos,frota}:
sem as variantes, o srcset aponta para arquivos inexistentes.

    python3 scripts/gerar-variantes-imagens.py

Requer Pillow (python3 -c "import PIL").
"""

import os
import sys

from PIL import Image

RAIZ = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PASTAS = ("servicos", "frota")
# Precisa espelhar LARGURAS_CARD em src/app/content/site-content.ts.
# O arquivo sem sufixo é a maior largura (900w) e serve de fallback no `src`.
LARGURAS = (400, 560, 672)
QUALIDADE = 78


def e_original(nome: str) -> bool:
    """Descarta as próprias variantes (`-400.webp`) para não gerar em cascata."""
    if not nome.endswith(".webp"):
        return False
    caule = nome.rsplit(".", 1)[0]
    sufixo = caule.rsplit("-", 1)[-1]
    return not sufixo.isdigit()


def main() -> int:
    total = 0
    for pasta in PASTAS:
        caminho = os.path.join(RAIZ, pasta)
        for nome in sorted(os.listdir(caminho)):
            if not e_original(nome):
                continue
            origem = os.path.join(caminho, nome)
            with Image.open(origem) as im:
                largura_original, altura_original = im.size
                for largura in LARGURAS:
                    if largura >= largura_original:
                        continue
                    altura = round(altura_original * largura / largura_original)
                    destino = os.path.join(
                        caminho, f"{nome.rsplit('.', 1)[0]}-{largura}.webp"
                    )
                    im.resize((largura, altura), Image.LANCZOS).save(
                        destino, "WEBP", quality=QUALIDADE, method=6
                    )
                    print(f"{pasta}/{os.path.basename(destino)} {largura}x{altura}")
                    total += 1
    print(f"\n{total} variantes geradas.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
