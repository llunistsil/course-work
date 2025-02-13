import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TgLoginWidgetComponent } from './tg-login-widget/tg-login-widget.component';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        TuiCardLarge,
        TgLoginWidgetComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.less',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        if (this.authService.currentUser) {
            this.router.navigate(['']);
        }
    }
}
