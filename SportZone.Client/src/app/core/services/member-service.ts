import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { UserProfile } from '../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  members = signal<UserProfile[]>([]);

  getMembers() {
    this.http.get<UserProfile[]>(`${this.apiUrl}Members`).subscribe({
      next: res => {
        this.members.set(res);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getMemberDetail(userId: string): Observable<UserProfile> {
    // Gửi một object khớp với class MemberIdRequest ở Backend
    return this.http.post<UserProfile>(`${this.apiUrl}Members/detail`, { memberId: userId });
  }
}
