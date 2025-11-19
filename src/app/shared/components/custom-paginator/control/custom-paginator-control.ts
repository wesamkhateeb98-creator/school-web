import { signal } from "@angular/core";

export class CustomPaginatorControl{
    countPages = signal<number>(1);
    selectedPage = signal<number>(1);

    constructor(countPages:number, selectedPage:number) {
        this.countPages.set(countPages);
        this.selectedPage.set(selectedPage);
    }

    changePage(newPage:number){
        this.selectedPage.set(newPage);
    }
}