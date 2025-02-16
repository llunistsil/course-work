import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TransactionService } from './transactions/transactions.service';
import { Category, CategoryService } from './categories/categories.service';
import { NgForOf } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { CategoriesComponent } from './categories/categories.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    standalone: true,
    imports: [
        TransactionsComponent,
        TuiCardLarge,
        TuiAppearance,
        CategoriesComponent
    ],
    styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
    undefinedTransactions: any = [];
    categories: Category[] = [];
    maxAmount = 0;

    constructor(
        private transactionService: TransactionService,
        private categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.transactionService.getUndefinedTransactions().subscribe(transactions => {
            this.undefinedTransactions = transactions;
            this.maxAmount = Math.max(...transactions.map(t => t.amount));
        });
    }

    getCircleSize(amount: number): number {
        const size = (amount / this.maxAmount) * 200;
        return Math.max(100, size);
    }

    // protected showDialogWithCustomButton(): void {
    //     this.dialogs
    //         .open('Good, Anakin, Good!', {
    //             label: 'Star wars. Episode III',
    //             size: 's',
    //             data: {button: 'Do it!'},
    //         })
    //         .subscribe();
    // }
}