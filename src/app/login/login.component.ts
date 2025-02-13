import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.less',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

}
