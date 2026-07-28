import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HERO, linkWhatsApp } from './content/site-content';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly hero = HERO;
  protected readonly linkWhatsApp = linkWhatsApp;
}
