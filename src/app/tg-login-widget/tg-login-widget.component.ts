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
import { take } from 'rxjs';
import { WidgetConfiguration } from './widget';
import { User } from '../auth/models/user';

const TELEGRAM_WIDGET_VERSION = 22;

const config: WidgetConfiguration = {
    buttonStyle: "large",
    cornerRadius: 16,
    showUserPhoto: true,
    accessToWriteMessages: true,
}

@Component({
    selector: 'app-tg-login-widget',
    imports: [CommonModule],
    template: '<div #scriptContainer></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class TgLoginWidgetComponent implements AfterViewInit {
    private readonly document = inject(DOCUMENT);
    private readonly authService = inject(AuthService);
    private readonly window: {[key: string]: any}  = window;

    @ViewChild('scriptContainer', { static: true }) scriptContainer!: ElementRef;

    private readonly defaultConfig = {
        src: `https://telegram.org/js/telegram-widget.js?${ TELEGRAM_WIDGET_VERSION }`,
        'data-onauth': `onTelegramLogin(user)`,
        'onerror': `onTelegramWidgetLoadFail()`,
        'onload': `onTelegramWidgetLoad()`
    };

    constructor(private ngZone: NgZone) {}

    ngAfterViewInit() {
        const scriptAttrs = this.compileConfigs();
        const script = this.document.createElement('script');

        //TODO добавить заполнение атрибутов скрипта из scriptAttrs


        this.window['onTelegramLogin'] = (data: User) => this.ngZone.run(() => this.authService.login(data).subscribe());

        this.scriptContainer.nativeElement.innerHTML = '';
        this.scriptContainer.nativeElement.appendChild(script);
    }


    private compileConfigs(): object {
        const configs: { [key: string]: string }  = this.defaultConfig ?? {};

        if (!this.authService.currentBot) {
            this.authService.getBotName$().pipe(take(1)).subscribe(
                botName => configs['data-telegram-login'] = botName
            )
        }

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
