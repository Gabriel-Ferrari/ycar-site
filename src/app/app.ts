import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class App {}
