import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { DADOS_ESTRUTURADOS } from './content/site-content';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Services } from './components/services';
import { About } from './components/about';
import { Steps } from './components/steps';
import { Fleet } from './components/fleet';
import { Contact } from './components/contact';
import { Footer } from './components/footer';
import { WhatsappFab } from './components/whatsapp-fab';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Hero, Services, About, Steps, Fleet, Contact, Footer, WhatsappFab],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Só no pré-render: o <head> não é hidratado, o script fica no HTML estático
    if (!isPlatformServer(inject(PLATFORM_ID))) return;
    const documento = inject(DOCUMENT);
    const script = documento.createElement('script');
    script.type = 'application/ld+json';
    // "<" escapado: texto vindo do painel não pode fechar a tag </script>
    script.textContent = JSON.stringify(DADOS_ESTRUTURADOS).replace(/</g, '\\u003c');
    documento.head.appendChild(script);
  }
}
