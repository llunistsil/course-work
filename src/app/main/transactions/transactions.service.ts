import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { LongPollingService } from '../polling.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private readonly pollingService = inject(LongPollingService);
    private readonly _transactions$ = new BehaviorSubject<any>([]);
    constructor(private http: HttpClient) {}

    get transactions$(): Observable<any> {
        return this._transactions$.asObservable();
    }

    setTransaction$(tran: any) {
        this._transactions$.next(tran);
    }

    getUndefinedTransactions() {
        return this.http.get<any[]>('/transactions').pipe(
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    defineTransaction(transactionDefined: any) {
        return this.http.post('/transaction/define', transactionDefined);
    }

    addTransaction(message: string) {
        return this.http.post('/transaction', { message, date: new Date().toISOString() });
    }

    registerSingle() {
        return this.http.get('/account/register/single').pipe(
            catchError(error => {
                console.error('Registration failed:', error);
                return of(null);
            })
        );
    }

    startPollingTransactions(): void {
        const config = {
            pollingRequest: () => this.http.get<any>('/transactions'),
            onResponse: (transactions: any) => this._transactions$.next(transactions),
            onError: (error: any) => this.registerSingle().subscribe(),
            inactivityTimeout: 30000
        };

        this.pollingService.startPolling(config);
    }

    destroy(): void {
        this.pollingService.stopPolling();
    }

}
