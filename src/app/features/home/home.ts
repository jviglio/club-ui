import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/ai/ai.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { EcommerceWebhookService } from '../../core/webhooks/ecommerce-webhook.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
})
export class HomeComponent {
  text = 'Hace una consulta aqui...';
  summary = '';
  loading = false;
  error = '';

  constructor(private ai: AiService, private webhook: EcommerceWebhookService, private cdr: ChangeDetectorRef) {}

  summarizeWebhook(): void {
  this.loading = true;
  this.error = '';
  this.summary = '';

  const payload = {
    message: this.text,
    timestamp: new Date().toISOString(),
    messageId: `msg_${Date.now()}`,
    metadata: {
      website: 'JP Tech - Desarrollo de IA',
      source: 'Home Chat',
      pageUrl: window.location.href,
      sessionId: 'session_home',
      messageCount: 1
    }
  };

  this.webhook.send(payload).subscribe({
    next: (res) => {
      this.loading = false;

      const reply = (res as any).reply;

      try {
        const parsed = JSON.parse(reply);
        this.summary = parsed.output ?? reply;
      } catch {
        this.summary = reply;
      }

      this.cdr.detectChanges();
    },
    error: (e) => {
      this.loading = false;
      this.error = e?.error ?? 'Falló la llamada al webhook';
      this.cdr.detectChanges();
    }
  });
}


  // summarize(): void {
  //   this.loading = true;
  //   this.error = '';
  //   this.summary = '';

  //   this.ai.summarize(this.text).subscribe({
  //     next: (res) => {
  //       this.loading = false;
  //       this.summary = res.summary;
  //       console.log(this.summary);
  //       this.cdr.detectChanges();        
  //     },
  //     error: (e) => {
  //       this.loading = false;
  //       this.error = e?.error ?? 'Falló la llamada';
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }
}
