import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';

@Component({
    selector: 'app-settings',
    imports: [
        TuiCardLarge,
        TuiButton
    ],
    templateUrl: './settings.component.html',
    standalone: true,
    styleUrl: './settings.component.less'
})
export class SettingsComponent {

    constructor(
        private http: HttpClient,
    ) {}

    downloadBackup() {
        this.http.get('/settings/backup', { responseType: 'blob' }).subscribe(blob => {
            const date = new Date();
            const dateString = [
                ('0' + date.getDate()).slice(-2),
                ('0' + (date.getMonth() + 1)).slice(-2),
                date.getFullYear()
            ].join('.');
            saveAs(blob, `${dateString}-overmoney.json`);
        });
    }

    downloadExcel() {
        this.http.get('/settings/export/excel', { responseType: 'blob' }).subscribe(blob => {
            const date = new Date();
            const dateString = [
                ('0' + date.getDate()).slice(-2),
                ('0' + (date.getMonth() + 1)).slice(-2),
                date.getFullYear()
            ].join('.');
            saveAs(blob, `${dateString}-export.xlsx`);
        });
    }

}
