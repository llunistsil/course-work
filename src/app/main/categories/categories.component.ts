import { Component, inject, OnInit } from '@angular/core';
import { Category, CategoryService } from './categories.service';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiAlertService, TuiAppearance, TuiButton, TuiDialog } from '@taiga-ui/core';
import { TransactionService } from '../transactions/transactions.service';
import { DragDropDirective } from '../drag-drop.directive';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.less'],
    standalone: true,
    imports: [
        TuiCardMedium,
        TuiAppearance,
        DragDropDirective,
        TuiDialog,
        ReactiveFormsModule,
        TuiInputModule,
        TuiAutoFocus,
        TuiSelectModule,
        TuiButton,
        AsyncPipe
    ]
})
export class CategoriesComponent implements OnInit {
    protected readonly categoryService = inject(CategoryService);
    private readonly transactionService = inject(TransactionService);
    private readonly alerts = inject(TuiAlertService);
    protected readonly categoryTypes = ['EXPENSE', 'INCOME'];
    categories: Category[] = [];
    protected categoryForm = new FormGroup({
        nameControl: new FormControl('', [Validators.required]),
        typeControl: new FormControl('INCOME')
    });
    protected open = false;

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(categories => this.categories = categories);
    }

    onDrop(event: any) {
        this.transactionService.defineTransaction(event).subscribe({
            next: () => {
                let trans;
                this.transactionService.transactions$.subscribe((tran) => trans = tran.filter((tr: any) => tr.id !== event.transactionId));
                this.transactionService.setTransaction$(trans);
                console.log(event);
                this.showToast();
            },
            error: (err) => console.error(err)
        });
    }

    private showToast() {
        this.alerts
            .open('Транзакция добавлена', { label: 'Успех!', appearance: 'positive' })
            .subscribe();
    }

    protected createCategory() {
        this.categoryService.createCategory(
            {name: this.categoryForm.controls.nameControl.value, type: this.categoryForm.controls.typeControl.value}
        ).subscribe( () => window.location.reload());
    }
}