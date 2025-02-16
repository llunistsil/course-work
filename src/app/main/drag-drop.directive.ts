import {
    Directive,
    HostBinding,
    HostListener,
    Output,
    EventEmitter,
    ElementRef
} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appDragDrop]'
})
export class DragDropDirective {
    @HostBinding('class.over') isOver = false;
    @Output() dropped = new EventEmitter<{transactionId: string, categoryId: string}>();

    @HostListener('dragenter', ['$event'])
    onDragEnter(event: DragEvent) {
        event.preventDefault();
        this.isOver = true;
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
        this.isOver = false;
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isOver = false;

        const transactionId = event.dataTransfer?.getData('elementId');
        const categoryId = this.element.nativeElement.dataset['id'];

        if(transactionId && categoryId) {
            this.dropped.emit({ transactionId, categoryId });
        }
    }

    constructor(private element: ElementRef) {}
}