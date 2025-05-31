import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Sửa styleUrl -> styleUrls
})
export class AppComponent {
  title = 'fashion-shop';

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true; // Kích hoạt hiệu ứng ripple
  }

  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Toast is working!',
    });
  }
}
