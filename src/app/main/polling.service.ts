import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subject, timer, of } from 'rxjs';
import { switchMap, takeUntil, catchError, tap } from 'rxjs/operators';

type PollingConfig<T> = {
    pollingRequest: () => Observable<T>;
    onResponse: (response: T) => void;
    onError?: (error: any) => void;
    inactivityTimeout?: number;
};

class FibonacciStrategy {
    private sequence = [1, 1];

    nextDelay(): number {
        const next = this.sequence[0] + this.sequence[1];
        this.sequence = [this.sequence[1], next];
        console.log(this.sequence)
        return next * 5000;
    }

    reset(): void {
        this.sequence = [1, 1];
        console.log(this.sequence)
    }
}

@Injectable({ providedIn: 'root' })
export class LongPollingService implements OnDestroy {
    private destroy$ = new Subject<void>();
    private activity$ = new Subject<void>();
    private strategy = new FibonacciStrategy();
    private lastActivity = 0;
    private active = false;

    constructor(private ngZone: NgZone) {
        this.setupActivityListeners();
    }

    startPolling<T>(config: PollingConfig<T>): void {
        this.ngZone.runOutsideAngular(() => {
            this.checkInactivity(config.inactivityTimeout || 30000);

            this.activity$
                .pipe(
                    switchMap(() => timer(0, this.strategy.nextDelay())),
                    switchMap(() => config.pollingRequest().pipe(
                        tap(response => this.ngZone.run(() => config.onResponse(response))),
                        catchError(error => {
                            this.ngZone.run(() => config.onError?.(error));
                            return of(null);
                        })
                    )),
                    takeUntil(this.destroy$)
                )
                .subscribe();
        });
    }

    stopPolling(): void {
        this.destroy$.next();
        this.strategy.reset();
    }

    private setupActivityListeners(): void {
        const events = ['mousemove', 'keypress', 'click', 'touchstart', 'touchmove', 'scroll'];

        events.forEach(event => {
            window.addEventListener(event, () => this.recordActivity());
        });
    }

    private recordActivity(): void {
        this.lastActivity = Date.now();
        if (!this.active) {
            this.active = true;
            this.activity$.next();
        }
    }

    private checkInactivity(timeout: number): void {
        timer(0, 1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (Date.now() - this.lastActivity > timeout) {
                    this.active = false;
                    this.strategy.reset();
                }
            });
    }

    ngOnDestroy(): void {
        this.stopPolling();
    }
}