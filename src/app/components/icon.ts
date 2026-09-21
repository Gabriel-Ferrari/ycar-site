import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'briefcase'
  | 'plane'
  | 'clock'
  | 'road'
  | 'star'
  | 'user'
  | 'shield'
  | 'watch'
  | 'document'
  | 'instagram'
  | 'whatsapp'
  | 'mail'
  | 'pin'
  | 'globe'
  | 'car'
  | 'van'
  | 'bus'
  | 'menu'
  | 'close'
  | 'chevron-right';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('briefcase') {
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        }
        @case ('plane') {
          <path
            fill="currentColor"
            stroke="none"
            d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
          />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        }
        @case ('road') {
          <path d="M4 20 8.5 4" />
          <path d="M20 20 15.5 4" />
          <path d="M12 7v2.5" />
          <path d="M12 13v2.5" />
          <path d="M12 19v1" />
        }
        @case ('star') {
          <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7z" />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
        }
        @case ('shield') {
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        }
        @case ('watch') {
          <circle cx="12" cy="12" r="6" />
          <path d="M12 9.5V12l1.8 1.2" />
          <path d="M9.5 6.5 10 3h4l.5 3.5" />
          <path d="M9.5 17.5 10 21h4l.5-3.5" />
        }
        @case ('document') {
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        }
        @case ('instagram') {
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        }
        @case ('whatsapp') {
          <path
            fill="currentColor"
            stroke="none"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
          />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        }
        @case ('pin') {
          <path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 0 1 13 0c0 4.6-6.5 10-6.5 10z" />
          <circle cx="12" cy="11" r="2.5" />
        }
        @case ('menu') {
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        }
        @case ('close') {
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" />
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path
            d="M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9s1.3-6.6 3.8-9z"
          />
        }
        @case ('car') {
          <path d="M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4" />
          <path d="M4 12h16" />
          <path d="M6.5 16h.01" />
          <path d="M17.5 16h.01" />
          <path
            d="M4 16h16v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V18h-9v.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
          />
        }
        @case ('van') {
          <path d="M2 8a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v9H2z" />
          <path d="M15 10h3.6a1 1 0 0 1 .9.55L21.5 14a1 1 0 0 1 .1.45V17H15" />
          <circle cx="6.5" cy="17.5" r="1.8" />
          <circle cx="17.5" cy="17.5" r="1.8" />
          <path d="M5 10h4v3H5z" />
        }
        @case ('bus') {
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13H4z" />
          <path d="M4 11h16" />
          <path d="M4 18v1.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V18" />
          <path d="M16.5 18v1.5a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1V18" />
          <path d="M8 15h.01" />
          <path d="M16 15h.01" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
}
