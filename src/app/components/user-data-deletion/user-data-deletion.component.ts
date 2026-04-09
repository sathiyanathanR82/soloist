import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-data-deletion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-data-deletion.component.html',
  styleUrls: ['./user-data-deletion.component.scss']
})
export class UserDataDeletionComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
