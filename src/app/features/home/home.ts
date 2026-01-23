import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/ai/ai.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private ai: AiService, private cdr: ChangeDetectorRef) {}

  summarize(): void {
    this.loading = true;
    this.error = '';
    this.summary = '';

    this.ai.summarize(this.text).subscribe({
      next: (res) => {
        this.loading = false;
        this.summary = res.summary;
        console.log(this.summary);
        this.cdr.detectChanges();        
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error ?? 'Falló la llamada';
        this.cdr.detectChanges();
      }
    });
  }
}
