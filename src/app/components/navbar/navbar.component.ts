import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDarkMode: boolean = false;
  @Input() isOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private themeService: ThemeService, private router: Router) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
