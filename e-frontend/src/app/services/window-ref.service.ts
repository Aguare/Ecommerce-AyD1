import { Injectable } from '@angular/core';

function getWindow(): any {
  return typeof window !== 'undefined' ? window : null;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {
  get nativeWindow(): any {
    return getWindow();
  }
}
