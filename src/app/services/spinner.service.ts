import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading = signal<boolean>(false);

  public showSpinner() {
    this.isLoading.set(true);
  }

  public hideSpinner() {
    this.isLoading.set(false);
  }

}
