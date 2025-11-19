import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CustomPaginatorControl } from './control/custom-paginator-control';

@Component({
  selector: 'app-custom-paginator',
  imports: [MatIconModule],
  templateUrl: './custom-paginator.html',
  styleUrl: './custom-paginator.scss',
})
export class CustomPaginator implements OnChanges {
  // --- Inputs & Outputs ---
  @Input() customPaginatorController!:CustomPaginatorControl;
  
  // --- Internal State ---
  visiblePages: number[] = [];
  readonly MAX_VISIBLE_PAGES = 5;

  ngOnChanges() {
    this.generateVisiblePages();
  }

  // Same pagination logic as before (for centering page numbers)
  private generateVisiblePages(): void {
    const total = this.customPaginatorController.countPages();
    const current = this.customPaginatorController.selectedPage();
    const max = this.MAX_VISIBLE_PAGES;

    if (total <= max) {
      this.visiblePages = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }
    
    let startPage = Math.max(1, current - Math.floor(max / 2));
    let endPage = Math.min(total, startPage + max - 1);

    if (endPage - startPage + 1 < max) {
      startPage = Math.max(1, endPage - max + 1);
    }
    
    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  // --- Methods ---

  goToPage(page: number): void {
    if (page >= 1 && page <= this.customPaginatorController.countPages() && page !== this.customPaginatorController.selectedPage()) {
      this.customPaginatorController.changePage(page);
    }
  }

  goToPrevious(): void {
    this.goToPage( this.customPaginatorController.countPages()- 1);
  }

  goToNext(): void {
    this.goToPage(this.customPaginatorController.countPages() + 1);
  }
}
