import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, AuthResponse } from '../models/user.model';

export interface NetworkRequest extends User {
  inviteMessage?: string;
  createdAt?: Date;
}

export interface NetworkInfoResponse {
  success: boolean;
  data: {
    myNetwork: User[];
    requests: NetworkRequest[];
    removalRequests: NetworkRequest[];
  };
}

export interface Message {
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  type?: 'invite' | 'message';
}

export interface MessageResponse {
  success: boolean;
  data: {
    message?: Message;
    messages?: Message[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private readonly API_URL = `${environment.apiUrl || 'http://localhost:3000/api'}/users`;

  private networkRequestsSubject = new BehaviorSubject<number>(0);
  public networkRequestsCount$ = this.networkRequestsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getNetworkInfo(): Observable<NetworkInfoResponse> {
    return this.http.get<NetworkInfoResponse>(`${this.API_URL}/network/info`).pipe(
      tap(response => {
        if (response.success) {
          const pendingCount = (response.data.requests?.length || 0) + (response.data.removalRequests?.length || 0);
          this.networkRequestsSubject.next(pendingCount);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  sendRequest(targetId: string, message?: string): Observable<any> {
    const payload = message ? { message } : {};
    return this.http.post<any>(`${this.API_URL}/network/request/${targetId}`, payload);
  }

  approveRequest(requesterId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/approve/${requesterId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  rejectRequest(requesterId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/reject/${requesterId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  removeConnection(targetId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/remove/${targetId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  approveRemoval(requesterId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/remove-approve/${requesterId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  rejectRemoval(requesterId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/remove-reject/${requesterId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  cancelRequest(targetId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/cancel/${targetId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  blockUser(targetId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/block/${targetId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  unblockUser(targetId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/network/unblock/${targetId}`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  private refreshCount(): void {
    this.getNetworkInfo().subscribe();
  }

  updateRequestCount(count: number) {
    this.networkRequestsSubject.next(count);
  }

  sendMessage(recipientId: string, messageText: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.API_URL}/messages/send`, {
      recipientId,
      text: messageText
    }).pipe(
      tap(response => {
        if (response.success) {
          console.log('Message sent successfully');
        }
      }),
      catchError(err => {
        console.error('Error sending message:', err);
        return throwError(() => err);
      })
    );
  }

  getMessages(withUserId: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.API_URL}/messages/${withUserId}`).pipe(
      catchError(err => {
        console.error('Error fetching messages:', err);
        return throwError(() => err);
      })
    );
  }
}
