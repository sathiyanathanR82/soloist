import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Message {
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  type?: 'invite' | 'message';
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="messages-container">
  <div class="messages-header">
    <h1>Messages</h1>
  </div>
  <div class="messages-content">
    <div class="connections-list">
      <div class="list-header">
        <h3>Connections</h3>
      </div>
      <div class="connection-item" *ngFor="let user of myNetwork" (click)="selectConversation(user)" [class.active]="selectedUser?.uid === user.uid">
        <div class="avatar">{{ getInitials(user) }}</div>
        <div class="info">
          <h4>{{ user.firstName }} {{ user.lastName }}</h4>
          <p>{{ getLastMessagePreview(user) }}</p>
        </div>
      </div>
    </div>
    <div class="chat-area" *ngIf="selectedUser">
      <div class="chat-header">
        <h3>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
      </div>
      <div class="messages-list">
        <div class="message" *ngFor="let msg of conversation" [class.own]="msg.from === currentUserId">
          <div class="message-content">{{ msg.text }}</div>
          <div class="message-time">{{ msg.timestamp | date:'short' }}</div>
        </div>
      </div>
      <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="message-form">
        <input formControlName="text" placeholder="Type a message..." />
        <button type="submit" [disabled]="messageForm.invalid">Send</button>
      </form>
    </div>
  </div>
</div>
  `,
  styles: [`
.messages-container { display: flex; flex-direction: column; height: 100vh; }
.messages-content { display: flex; flex: 1; }
.connections-list { width: 300px; border-right: 1px solid #eee; }
.connection-item { padding: 12px; cursor: pointer; display: flex; align-items: center; }
.connection-item.active { background: #f5f5f5; }
.chat-area { flex: 1; display: flex; flex-direction: column; }
.messages-list { flex: 1; padding: 20px; overflow-y: auto; }
.message { margin-bottom: 16px; }
.message.own { text-align: right; }
.message-content { display: inline-block; max-width: 70%; padding: 8px 12px; border-radius: 18px; background: #007bff; color: white; }
.message.own .message-content { background: #e9ecef; color: #333; }
  `]
})
export class MessagesComponent implements OnInit {
  myNetwork: User[] = [];
  selectedUser: User | null = null;
  conversation: Message[] = [];
  messageForm!: FormGroup;
  currentUserId: string = '';

  constructor(
    private networkService: NetworkService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.uid || '';
    this.loadNetwork();
    this.messageForm = this.fb.group({
      text: ['', Validators.required]
    });
  }

  loadNetwork(): void {
    this.networkService.getNetworkInfo().subscribe(res => {
      if (res.success) {
        this.myNetwork = res.data.myNetwork || [];
      }
    });
  }

  selectConversation(user: User): void {
    this.selectedUser = user;
    this.loadConversation(user.uid!);
  }

  loadConversation(withUserId: string): void {
    // TODO: Call networkService.getConversation(withUserId)
    this.conversation = []; // Placeholder
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.selectedUser) {
      // TODO: networkService.sendMessage(selectedUser.uid!, this.messageForm.value.text)
      this.messageForm.reset();
    }
  }

  getInitials(user: User): string {
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  }

  getLastMessagePreview(user: User): string {
    return 'No messages yet';
  }
}
