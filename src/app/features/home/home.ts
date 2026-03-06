import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { EcommerceWebhookService } from '../../core/webhooks/ecommerce-webhook.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  text = '';
  loading = false;
  messageId = `msg_${Date.now()}`;

  messages: { role: 'user' | 'ai', content: string }[] = [];

  constructor(
    private webhook: EcommerceWebhookService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router    
  ) {}
  
  ngOnInit(): void {
    const token = this.auth.getToken();

    if (!token) {
      this.router.navigateByUrl('/login');
    }
  }

  sendMessage(): void {

    if (!this.text.trim()) return;

    const userText = this.text;

    this.messages.push({ role: 'user', content: userText });
    this.text = '';
    this.loading = true;

    const payload = {
      message: userText,
      timestamp: new Date().toISOString(),
      messageId: this.messageId,
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
          /!\[.*?\]\((.*?)\)/g,
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