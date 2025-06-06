import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'fashion-shop';

  constructor(private messageService: MessageService) {
    // Component initialization
  }

  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Toast is working!',
    });
  }
}
