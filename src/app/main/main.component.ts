import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-main',
    imports: [],
    templateUrl: './main.component.html',
    styleUrl: './main.component.less',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

}
