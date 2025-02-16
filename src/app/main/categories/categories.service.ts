import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';


export interface Category {
    id?: number;
    keywords?: Array<{ accountId: number; name: string }>;
    name: string;
    type?: "INCOME" | "EXPENSE";
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private _highlightedCategory$ = new BehaviorSubject<number | null>(null);
    constructor(private http: HttpClient) {
    }

    get highlightedCategory$(): Observable<number | null> {
        return this._highlightedCategory$.asObservable();
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>('/categories/')
            .pipe(
                switchMap((res) => {
                    if (res.length === 0) {
                        console.log(res);
                        return this.addDefaultCategories();
                    }
                    console.log(res);

                    return of(res);
                })
            );
    }

    addDefaultCategories(): Observable<Category[]> {
        return this.http.post('/categories/add-default-categories', {})
            .pipe(
                switchMap(() => this.getCategories()),
            );
    }

    createCategory(category: any) {
        console.log(category);
        return this.http.post('/categories/', category);
    }

    highlightCategory(categoryId: number): void {
        this._highlightedCategory$.next(categoryId);
    }

    unhighlightCategory(categoryId: number): void {
        if (this._highlightedCategory$.value === categoryId) {
            this._highlightedCategory$.next(null);
        }
    }

}