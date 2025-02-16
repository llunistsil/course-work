// transaction-history.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import {
    TuiTableCell,
    TuiTableDirective, TuiTableHead,
    TuiTableSortPipe,
    TuiTableTbody, TuiTableTd,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTr
} from '@taiga-ui/addon-table';
import { TuiLet } from '@taiga-ui/cdk';
import { DatePipe, NgForOf } from '@angular/common';
import { TuiStatus } from '@taiga-ui/kit';
import { BehaviorSubject } from 'rxjs';

interface Transaction {
    id: number;
    categoryName?: string;
    amount: number;
    message: string;
    date: string;
    telegramUserName: string;

    [key: string]: any;
}

@Component({
    selector: 'app-transaction-history',
    templateUrl: './history.component.html',
    standalone: true,
    imports: [
        TuiTableDirective,
        TuiTableThGroup,
        TuiLet,
        TuiTableTbody,
        NgForOf,
        TuiTableSortPipe,
        TuiTableTr,
        TuiTableTh,
        TuiTableHead,
        TuiTableCell,
        TuiTableTd,
        DatePipe,
        TuiStatus,
        TuiButton
    ],
    styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
    // Колонки таблицы
    columns = ['categoryName', 'amount', 'message', 'date', 'telegramUserName', 'actions'];
    humanColumns = ['categoryName', 'amount', 'message', 'date', 'telegramUserName'];

    // Заголовки колонок
    columnNames: { [key: string]: string } = {
        categoryName: 'Категория',
        amount: 'Сумма',
        message: 'Примечание',
        date: 'Дата',
        telegramUserName: 'Пользователь',
        actions: 'Действия'
    };

    // Данные
    transactions = new BehaviorSubject<Transaction[]>([]);
    pageSize = 50;
    pageNumber = 0;
    loading = false;

    constructor(
        private http: HttpClient,
        private dialogService: TuiDialogService
    ) {
    }

    ngOnInit(): void {
        this.loadTransactions();
    }

    loadTransactions(): void {
        this.loading = true;
        this.http.get<Transaction[]>(
            `/transactions/history?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`
        ).subscribe({
            next: (data) => {
                this.transactions.next([
                    ...data.map(item => ({
                        ...item,
                        date: new Date(item.date).toISOString()
                    }))
                ]);
                this.pageNumber++;
                this.loading = false;
                console.log(this.transactions.value);
            },
            error: () => this.loading = false
        });
    }

    delete(transaction: Transaction): void {
        this.http.get(`/history/${transaction.id}`).subscribe(() => this.loadTransactions());
    }
}