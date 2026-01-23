import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EcommerceWebhookRequest {
  message: string;
  timestamp: string;
  messageId: string;
  metadata: {
    website: string;
    source: string;
    pageUrl: string;
    sessionId: string;
    messageCount: number;
  };
}

@Injectable({ providedIn: 'root' })
export class EcommerceWebhookService {
  private readonly url = `${environment.apiUrl}/api/webhooks/ecommerce`;

  constructor(private http: HttpClient) {}

  send(payload: EcommerceWebhookRequest) {
    return this.http.post<{ ok: boolean }>(this.url, payload);
  }
}
