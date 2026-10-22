import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { aplicarPrevia } from './app/content/site-content';

bootstrapApplication(App, appConfig)
  .then(() => {
    // Prévia do painel /admin: o site roda num iframe da mesma origem e o painel chama
    // ycarPrevia(conteudo) a cada edição. Só depois do bootstrap, para não quebrar a hidratação.
    if (window.parent === window || !new URLSearchParams(location.search).has('previa')) return;
    Object.assign(window, { ycarPrevia: aplicarPrevia });
    window.parent.postMessage('ycar-previa-pronta', location.origin);
  })
  .catch((err) => console.error(err));
