import { Injectable, OnDestroy, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { fromEvent, Subscription } from 'rxjs';
import { Language } from './language';
import { errorMatSnackbarConfig } from '../consts';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService implements OnDestroy {
  private snackBar = inject(MatSnackBar);
  private language = inject(Language);
  private snackBarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;
  private offlineSub!: Subscription;
  private onlineSub!: Subscription;

  init() {
    this.offlineSub = fromEvent(window, 'offline').subscribe(() => this.showOffline());
    this.onlineSub = fromEvent(window, 'online').subscribe(() => this.hideOffline());

    if (!navigator.onLine) {
      this.showOffline();
    }
  }

  private showOffline() {
    if (this.snackBarRef) return;
    const config = errorMatSnackbarConfig(this.language);
    config.duration = 0;
    this.snackBarRef = this.snackBar.open(
      this.language.transform('network_down'),
      this.language.transform('close'),
      config
    );
    this.snackBarRef.onAction().subscribe(() => {
      this.snackBarRef = null;
    });
  }

  private hideOffline() {
    this.snackBarRef?.dismiss();
    this.snackBarRef = null;
  }

  ngOnDestroy() {
    this.offlineSub?.unsubscribe();
    this.onlineSub?.unsubscribe();
  }
}
