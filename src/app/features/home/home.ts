import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { EcommerceWebhookService } from '../../core/webhooks/ecommerce-webhook.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {

  text = '';
  loading = false;

  messages: { role: 'user' | 'ai', content: string }[] = [];

  constructor(
    private webhook: EcommerceWebhookService,
    private cdr: ChangeDetectorRef
  ) {}

  sendMessage(): void {

    if (!this.text.trim()) return;

    const userText = this.text;

    this.messages.push({ role: 'user', content: userText });
    this.text = '';
    this.loading = true;

    const payload = {
      message: userText,
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}`,
      metadata: {
        website: 'JP Tech - Desarrollo de IA',
        source: 'Home Chat',
        pageUrl: window.location.href,
        sessionId: 'session_home',
        messageCount: this.messages.length
      }
    };

    this.webhook.send(payload).subscribe({
      next: (res: any) => {

        this.loading = false;

        let reply = res?.reply ?? 'Sin respuesta del servidor';

        try {
          const parsed = JSON.parse(reply);
          reply = parsed.output ?? reply;
        } catch {
          // no era JSON, lo dejamos como está
        }

        // Convertir markdown de imagen a <img>
        let formatted = reply.replace(
          /!\[Foto\]\((.*?)\)/g,
          `<img src="$1" style="width:100%;max-width:100%;height:auto;display:block;">`
        );

        this.messages.push({
          role: 'ai',
          content: formatted
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.messages.push({
          role: 'ai',
          content: 'Error en la consulta.'
        });
        this.cdr.detectChanges();
      }
    });
  }
}