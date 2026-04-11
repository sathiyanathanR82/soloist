import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class NetworkComponent implements OnInit {
  myNetwork: User[] = [];
  pendingRequests: (User & {inviteMessage: string})[] = [];

  suggestions: User[] = [];
  loading = true;
  currentUser: User | null = null;

  constructor(
    private networkService: NetworkService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNetwork();
    this.loadSuggestions();
  }

  loadNetwork(): void {
    this.loading = true;
    this.networkService.getNetworkInfo().subscribe({
      next: (res) => {
        if (res.success) {
          this.myNetwork = res.data.myNetwork;
          this.pendingRequests = res.data.requests as (User & { inviteMessage: string })[];
          
          console.log(this.pendingRequests);
          
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }


  loadSuggestions(): void {
    this.authService.getAllUsers().subscribe({
      next: (res) => {
        const allUsers = res.data || [];
        const currentUid = this.currentUser?.uid || this.currentUser?.id;
        
        // Filter out self, existing network, and pending requests
        this.suggestions = allUsers.filter((u: any) => {
          const uId = u.uid || u.id;
          if (uId === currentUid) return false;
          if (this.myNetwork.some(n => (n.uid || n.id) === uId)) return false;
          if (this.pendingRequests.some(r => (r.uid || r.id) === uId)) return false;
          
          // Also filter if current user is in THEIR request list (redundant but safe)
          return true;
        }).slice(0, 10);
      }
    });
  }

  approveRequest(requesterId: string): void {
    this.networkService.approveRequest(requesterId).subscribe(() => {
      this.loadNetwork();
    });
  }

  rejectRequest(requesterId: string): void {
    this.networkService.rejectRequest(requesterId).subscribe(() => {
      this.loadNetwork();
    });
  }

  sendRequest(targetId: string): void {
    this.networkService.sendRequest(targetId).subscribe(() => {
      // Optimistically update or just reload
      this.loadSuggestions();
    });
  }

  getInitials(user: User): string {
    return `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();
  }


  public capitalizeFirstLetter(string: string | undefined): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
