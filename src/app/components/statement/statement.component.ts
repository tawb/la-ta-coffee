import { Component } from '@angular/core';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  words = 'We do not chase the season. We buy one lot, we roast it light, and when it is gone we start again. That is the whole idea.'.split(' ');
}