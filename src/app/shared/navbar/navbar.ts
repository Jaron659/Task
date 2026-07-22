import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Modal } from '../../core/services/modal';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private modalService = inject(Modal);

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  async logout() {

    const confirmed = await this.modalService.confirm(
      'Logout',
      'Are you sure you want to logout?'
    );

    if (!confirmed) {
      return;
    }

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}