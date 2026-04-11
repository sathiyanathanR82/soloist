import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService, Message } from '../../services/network.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="full-body-container">
<div class="messages-container">
  <div class="messages-content">
    <div class="connections-list">
      <div class="list-header">
        <h3>My Network</h3>
      </div>
      @if (myNetwork.length > 0) {
        @for (user of myNetwork; track user.uid || user.id) {
          <div class="connection-item" (click)="selectConversation(user)" [class.active]="selectedUser?.uid === user.uid">
            <div class="avatar">{{ getInitials(user) }}</div>
            <div class="info">
              <h4>{{ user.firstName }} {{ user.lastName }}</h4>
              <p>{{ getLastMessagePreview(user) }}</p>
            </div>
          </div>
        }
      } @else {
        <div class="empty-connections">
          <p>No connections yet</p>
        </div>
      }
    </div>
    <div class="chat-area" *ngIf="selectedUser">
      <div class="chat-header">
        <h3>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
      </div>
      @if (loadingMessages) {
        <div class="messages-list loading">
          <p>Loading messages...</p>
        </div>
      }
      <div class="messages-list" *ngIf="!loadingMessages">
        @if (conversation.length === 0) {
          <div class="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        } @else {
          @for (msg of conversation; track $index) {
            <div class="message" [class.own]="msg.from === currentUserId">
              <div class="message-content">{{ msg.text }}</div>
              <div class="message-time">{{ formatDate(msg.timestamp) }}</div>
            </div>
          }
        }
      </div>
      <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="message-form">
        <input 
          type="text"
          formControlName="text" 
          placeholder="Type a message..." 
          class="message-input"
        />
        <button type="submit" class="send-btn" [disabled]="messageForm.invalid || isSending">
          @if (!isSending) { <span>Send</span> }
          @if (isSending) { <span>Sending...</span> }
        </button>
      </form>
    </div>
  </div>
</div>
</div>
  `,
  styles: [`
    .full-body-container {
    position: relative;
    width: 100%;
      height: calc(100vh - 72px);
    }


    .messages-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-color);
      bottom: 0px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    }

    .messages-header {
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      background: var(--surface-color);
      text-align: center;

      h1 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.8rem;
      }
    }

    .messages-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .connections-list {
      width: 300px;
      border-right: 2px solid var(--border-color);
      background: var(--surface-color);
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .list-header {
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        background: var(--surface-color);
        position: sticky;
        top: 0;

        h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
      }

      .empty-connections {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        text-align: center;
        padding: 20px;

        p {
          margin: 0;
        }
      }
    }

    .connection-item {
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(102, 126, 234, 0.1);
      }

      &.active {
        background: linear-gradient(90deg, rgba(102, 126, 234, 0.2), transparent);
        border-left: 4px solid var(--primary-color);
        padding-left: 12px;
      }

      .avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        flex-shrink: 0;
      }

      .info {
        flex: 1;
        min-width: 0;

        h4 {
          margin: 0 0 4px 0;
          color: var(--text-primary);
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-color);
      border-left: 2px solid var(--border-color);
    }

    .chat-header {
      padding: 16px;
      border-bottom: 2px solid var(--border-color);
      background: var(--surface-color);

      h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.1rem;
      }
    }

    .messages-list {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.loading {
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
      }

      .no-messages {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);

        p {
          margin: 0;
        }
      }
    }

    .message {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      &.own {
        align-items: flex-end;

        .message-content {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
        }
      }

      .message-content {
        display: inline-block;
        max-width: 70%;
        padding: 10px 14px;
        border-radius: 18px;
        background: var(--border-color);
        color: var(--text-primary);
        word-wrap: break-word;
        line-height: 1.4;
      }

      .message-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }

    .message-form {
      display: flex;
      gap: 10px;
      padding: 16px;
      border-top: 2px solid var(--border-color);
      background: var(--surface-color);

      .message-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid var(--border-color);
        border-radius: 24px;
        background: var(--input-bg);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.95rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &::placeholder {
          color: var(--text-secondary);
        }
      }

      .send-btn {
        padding: 10px 24px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 24px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not([disabled]) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        &[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    @media (max-width: 768px) {
      .messages-content {
        flex-direction: column;
      }

      .connections-list {
        width: 100%;
        border-right: none;
        border-bottom: 2px solid var(--border-color);
        max-height: 150px;
      }

      .message-content {
        max-width: 90% !important;
      }
    }
  `]
})
export class MessagesComponent implements OnInit {
  myNetwork: User[] = [];
  selectedUser: User | null = null;
  conversation: Message[] = [];
  messageForm!: FormGroup;
  currentUserId: string = '';
  loadingMessages = false;
  isSending = false;

  constructor(
    private networkService: NetworkService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.uid || currentUser?.id || '';
    this.loadNetwork();
    this.messageForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  loadNetwork(): void {
    this.networkService.getNetworkInfo().subscribe({
      next: (res) => {
        if (res.success) {
          this.myNetwork = res.data.myNetwork || [];
        }
      },
      error: (err) => {
        console.error('Error loading network:', err);
      }
    });
  }

  selectConversation(user: User): void {
    this.selectedUser = user;
    this.conversation = [];
    this.loadConversation(user.uid || user.id!);
  }

  loadConversation(withUserId: string): void {
    this.loadingMessages = true;
    this.networkService.getMessages(withUserId).subscribe({
      next: (res) => {
        if (res.success) {
          this.conversation = res.data.messages || [];
          // Scroll to bottom after loading
          setTimeout(() => {
            const messagesList = document.querySelector('.messages-list');
            if (messagesList) {
              messagesList.scrollTop = messagesList.scrollHeight;
            }
          }, 100);
        }
        this.loadingMessages = false;
      },
      error: (err) => {
        console.error('Error loading conversation:', err);
        this.conversation = [];
        this.loadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.selectedUser) {
      const messageText = this.messageForm.value.text.trim();
      if (!messageText) return;

      const recipientId = this.selectedUser.uid || this.selectedUser.id!;
      this.isSending = true;

      this.networkService.sendMessage(recipientId, messageText).subscribe({
        next: (res) => {
          if (res.success && res.data.message) {
            // Add message to conversation
            this.conversation.push(res.data.message);
            this.messageForm.reset();
            // Scroll to bottom
            setTimeout(() => {
              const messagesList = document.querySelector('.messages-list');
              if (messagesList) {
                messagesList.scrollTop = messagesList.scrollHeight;
              }
            }, 100);
          }
          this.isSending = false;
        },
        error: (err) => {
          console.error('Error sending message:', err);
          this.isSending = false;
        }
      });
    }
  }

  getInitials(user: User): string {
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  }

  getLastMessagePreview(user: User): string {
    return 'Click to chat';
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
