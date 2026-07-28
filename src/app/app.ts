import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Stats } from './components/stats';
import { Services } from './components/services';
import { Differentials } from './components/differentials';
import { Vehicle } from './components/vehicle';
import { Steps } from './components/steps';
import { Testimonials } from './components/testimonials';
import { Coverage } from './components/coverage';
import { Contact } from './components/contact';
import { Footer } from './components/footer';
import { WhatsappFab } from './components/whatsapp-fab';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Header,
    Hero,
    Stats,
    Services,
    Differentials,
    Vehicle,
    Steps,
    Testimonials,
    Coverage,
    Contact,
    Footer,
    WhatsappFab,
  ],
  templateUrl: './app.html',
})
export class App {}
