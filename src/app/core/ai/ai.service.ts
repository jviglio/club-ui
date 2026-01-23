import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  summarize(text: string): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(
      `${this.baseUrl}/api/ai/summarize`,
      { text }
    );
  }
}
