import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'app-front-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-nav-bar.component.html',
  styleUrl: './front-nav-bar.component.css',
})
export class FrontNavBarComponent {
  authService = inject(AuthService);
}
