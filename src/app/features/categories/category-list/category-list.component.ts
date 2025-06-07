import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  globalFilterFields = ['name', 'description'];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // TODO: Load categories from service
    this.loading = false;
  }

  applyFilterGlobal(event: Event, value: string): void {
    // TODO: Implement filtering
  }

  confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${category.categoryName}?`,
      accept: () => {
        // TODO: Implement delete logic
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully',
        });
      },
    });
  }
}
