import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    ViewChild,
    AfterViewInit,
    NgZone
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { take, tap } from 'rxjs';
import { WidgetConfiguration } from './widget';
import { User } from '../auth/models/user';
import { environment } from '../../../environments/environment';

const TELEGRAM_WIDGET_VERSION = 22;

const config: WidgetConfiguration = {
    buttonStyle: 'large',
    cornerRadius: 16,
    showUserPhoto: true,
    accessToWriteMessages: true
};

@Component({
    selector: 'app-tg-login-widget',
    imports: [CommonModule],
    template: `
      <div #scriptContainer class="widget">
        <ng-content></ng-content>
      </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    styleUrl: 'tg-login-widget.component.less'
})
export class TgLoginWidgetComponent implements AfterViewInit {
    private readonly document = inject(DOCUMENT);
    private readonly authService = inject(AuthService);

    @ViewChild('scriptContainer', { static: true }) scriptContainer!: ElementRef;

    private readonly defaultConfig = {
        src: `https://telegram.org/js/telegram-widget.js?${TELEGRAM_WIDGET_VERSION}`,
        'data-onauth': `onTelegramAuth(user)`
    };

    constructor(private ngZone: NgZone) {
    }

    ngAfterViewInit() {
        if (environment.setCookie) {
            document.cookie = 'accessToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5NTI2NTg1MTciLCJleHAiOjE3Mzk1Mzk3NjIsImZpcnN0TmFtZSI6IkRtaXRyaXkiLCJ1c2VybmFtZSI6InN1Y2Nlc3NmdWxseV9mYWlsIn0.ImtmNuPWVedizEK0FAkchTs4g8v0snxZ7KpN52Lu5CagvLokAQX-dHqMvKnMXIpj1Cxg_J9uVNMSZ0EnmSZjGQ; Path=/; Secure; HttpOnly; SameSite=None';

            return;
        }
        const scriptAttrs = this.compileConfigs();
        const script = this.document.createElement('script');

        console.log(scriptAttrs);

        for (const key in scriptAttrs) {
            if (Object.prototype.hasOwnProperty.call(scriptAttrs, key)) {
                script.setAttribute(key, scriptAttrs[key]);
            }
        }

        script.async = true;

        console.log(script);

        (window as any)['onTelegramAuth'] = (data: User) => this.ngZone.run(() => this.authService.login(data).subscribe());

        this.scriptContainer.nativeElement.innerHTML = '';
        this.scriptContainer.nativeElement.appendChild(script);
    }


    private compileConfigs(): Record<string, string> {
        const configs: { [key: string]: string } = this.defaultConfig ?? {};

        if (!this.authService.currentBot) {
            this.authService.getBotName$().pipe(take(1)).subscribe();
        }
        configs['data-telegram-login'] = 'TestingOverMoneyBot';

        if (config?.accessToWriteMessages) {
            configs['data-request-access'] = 'write';
        }

        if (config?.cornerRadius) {
            configs['data-radius'] = `${config.cornerRadius}`;
        }

        if (config?.showUserPhoto === false) {
            configs['data-userpic'] = 'false';
        }

        if (config?.buttonStyle) {
            configs['data-size'] = config.buttonStyle;
        } else {
            configs['data-size'] = 'large';
        }


        return configs;
    }

}
