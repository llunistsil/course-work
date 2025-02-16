// analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private colors = [
        "#cd5c5c", "#ffc0cb", "#ffa500", "#fafad2", "#e6e6fa",
        "#9370db", "#4b0082", "#bc8f8f", "#c0c0c0", "#00ff00",
        "#6495ed", "#ff0000", "#008000", "#20b2aa", "#800080",
        "#faebd7", "#696969", "#ffff00", "#ff1493", "#00ffff",
        "#e9967a", "#ffb6c1", "#9acd32", "#0000ff", "#46a5b2",
        "#32cd32", "#ffe4e1", "#000000", "#80800a", "#ff00ff",
        "#7fffd4", "#ffd700", "#2e8b57", "#dc143c", "#4169e1",
        "#e6e6fa", "#bdb76b", "#708090", "#32cd32", "#da70d6",
        "#191970", "#ffa07a", "#ffefd5", "#5f9ea0", "#8b4513",
        "#dcdcdc", "#8b008b", "#ff4500", "#00ff7f", "#87ceeb"
    ];

    constructor(private http: HttpClient) {}

    getCategoryData(type: string): Observable<any[]> {
        return this.http.get<any[]>(`/analytics/totalCategorySums/${type}`);
    }

    getAvailableYears(): Observable<number[]> {
        return this.http.get<number[]>('/analytics/available-years');
    }

    getMonthlyData(year: number): Observable<any> {
        return this.http.get(`/analytics/totalIncomeOutcome/${year}`);
    }

    getYearlyIncome(year: number): Observable<any[]> {
        return this.http.get<any[]>(`/analytics/income/${year}`);
    }

    getColor(index: number): string {
        return this.colors[index % this.colors.length];
    }
}