// O build por idioma (@angular/localize) copia public/ inteiro para /en/ e /es/.
// Os arquivos de public/ são servidos só pela raiz (caminhos absolutos no site); as cópias
// dobrariam o upload e deixariam um /en/admin/ sem os headers de segurança de /admin/*.
import { readdirSync, rmSync } from 'node:fs';

const DIST = 'dist/ycar-site/browser';
const IDIOMAS = ['en', 'es'];

for (const idioma of IDIOMAS) {
  for (const nome of readdirSync('public')) {
    rmSync(`${DIST}/${idioma}/${nome}`, { recursive: true, force: true });
  }
}
