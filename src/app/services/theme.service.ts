import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  // For SSR compatibility
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.applySavedTheme();
    }
  }

  applySavedTheme() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    this.isDarkModeSubject.next(isDarkMode);
    this.updateThemeClass(isDarkMode);
  }

  toggleDarkMode() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isDarkMode = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(isDarkMode);

    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    this.updateThemeClass(isDarkMode);
  }

  private updateThemeClass(isDarkMode: boolean) {
    const htmlElement = document.documentElement;

    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
