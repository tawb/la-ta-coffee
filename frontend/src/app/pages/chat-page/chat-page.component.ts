import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

interface ChatResponse {
  content: string;
}

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  messages: ChatMessage[] = [];
  currentMessage = '';
  loading = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    const text = this.currentMessage.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.currentMessage = '';
    this.loading = true;

    this.http.post('/api/chat', { message: text }, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.messages.push({ role: 'assistant', content: response });
        this.loading = false;
      },
      error: (err) => {
        const errorText = err.status === 401
          ? 'Please log in again.'
          : (err.error || 'Something went wrong. Please try again.');
        this.messages.push({ role: 'error', content: errorText });
        this.loading = false;
      }
    });
  }
}