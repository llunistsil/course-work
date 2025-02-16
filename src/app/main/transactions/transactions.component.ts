import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {  TuiMessage } from '@taiga-ui/kit';
import { TransactionService } from './transactions.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TuiAppearance, TuiButton, TuiDialog, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { CategoryService } from '../categories/categories.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [
        TuiMessage,
        TuiDialog,
        TuiInputModule,
        TuiButton,
        FormsModule,
        TuiAppearance,
        TuiCardMedium,
        ReactiveFormsModule,
        TuiAutoFocus
    ],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.less']
})
export class TransactionsComponent implements OnInit, OnDestroy {
    private readonly transactionService = inject(TransactionService);
    private readonly categoryService = inject(CategoryService);
    private readonly destroy$ = new Subject();
    protected undefinedTransactions: any = [];
    open = false;
    transactionForm = new FormGroup({
        messageControl: new FormControl('', [Validators.required]),
    })

    ngOnInit(): void {
        this.transactionService.startPollingTransactions();
        this.transactionService.transactions$.pipe(takeUntil(this.destroy$)).subscribe(
            (transactions) => this.undefinedTransactions = transactions
        )
    }

    ngOnDestroy(): void {
        this.transactionService.destroy();
        this.destroy$.complete();
    }

    onDragStart(event: DragEvent, transaction: any): void {
        if (event.dataTransfer) {
            event.dataTransfer.setData('amount', transaction.amount);
            event.dataTransfer.setData('elementId', transaction.id);
        }

        if (transaction.suggestedCategoryId) {
            this.categoryService.highlightCategory(transaction.suggestedCategoryId);
        }
    }

    onDragEnd(event: DragEvent, transaction: any): void {
        this.categoryService.unhighlightCategory(transaction.suggestedCategoryId);
    }


    submit() {
        this.transactionService.addTransaction(this.transactionForm.controls.messageControl.value!).subscribe();
    }
}