import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance, TuiTitle } from '@taiga-ui/core';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    standalone: true,
    imports: [
        FormsModule,
        TuiCardLarge,
        TuiAppearance,
        TuiTitle
    ],
    styleUrls: ['./analytics.component.less']
})
export class AnalyticsComponent implements OnInit {
    expenseAnalyticsData: any;
    incomeAnalyticsData: any;
    yearOptions: number[] = [];
    selectedYear: number = new Date().getFullYear();
    months: string[] = ["Янв", "Фев.", "Мар.", "Апр", "Май", "Июнь", "Июль", "Авг.", "Сен.", "Окт.", "Ноя.", "Дек."];

    constructor(private http: HttpClient) {
        Chart.register(...registerables); // Регистрация всех элементов Chart.js
    }

    ngOnInit(): void {
        this.getAnalyticsData('EXPENSE', 'expenseAnalytics');
        this.getAnalyticsData('INCOME', 'incomeAnalytics');
    }

    getAnalyticsData(type: 'EXPENSE' | 'INCOME', chartId: string): void {
        this.http.get<any[]>(`/analytics/totalCategorySums/${type}`).subscribe((data) => {
            this.drawAnalytics(data, chartId);
        });
    }

    drawAnalytics(data: any[], chartId: string): void {
        const categoriesName = data.map((item: any) => item.categoryName);
        const transactionSums = data.map((item: any) => item.mediumAmountOfTransactions);
        const colors = this.generateColors(data.length);

        const chart = new Chart(chartId, {
            type: 'pie',
            data: {
                labels: categoriesName,
                datasets: [{
                    label: 'Рублей',
                    data: transactionSums,
                    backgroundColor: colors,
                    hoverOffset: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    generateColors(count: number): string[] {
        const colors = [
            "rgb(205, 92, 92)", "rgb(255, 192, 203)", "rgb(255, 165, 0)", "rgb(250, 250, 210)",
            "rgb(230, 230, 250)", "rgb(147, 112, 219)", "rgb(75, 0, 130)", "rgb(188, 143, 143)",
            "rgb(192, 192, 192)", "rgb(0, 255, 0)", "rgb(100, 149, 237)", "rgb(255, 0, 0)",
            "rgb(0, 128, 0)", "rgb(32, 178, 170)", "rgb(128, 0, 128)", "rgb(250, 235, 215)"
        ];
        return colors.slice(0, count);
    }
}
