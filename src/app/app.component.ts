import { TuiButton, TuiIcon, TuiRoot } from '@taiga-ui/core';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './login/auth/auth.service';
import {
    TuiAsideComponent,
    TuiAsideItemDirective,
    TuiHeaderComponent,
    TuiLogoComponent,
    TuiMainComponent
} from '@taiga-ui/layout';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
    imports: [RouterModule, TuiRoot, TuiAsideItemDirective, TuiAsideComponent, TuiButton, TuiAvatar, TuiIcon, TuiHeaderComponent, TuiLogoComponent, TuiMainComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    standalone: true
})
export class AppComponent {
    protected authService = inject(AuthService);
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly router = inject(Router);
    protected expanded = signal(false);

    protected handleToggle(): void {
        this.expanded.update((e) => !e);
    }
}
