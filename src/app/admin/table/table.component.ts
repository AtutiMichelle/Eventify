import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() actions: boolean = false;

  @Output() updated = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  editingRow: any = null;
  editedData: any = {};

  columnMapping: { [key: string]: string } = {
    'Date Joined': 'date_joined' // Map column name to correct key
  };

  constructor(private coreService: CoreService) {}

  editRow(row: any) {
    this.editingRow = row;
    this.editedData = { ...row };
  }

  saveEdit() {
    if (this.editingRow) {
      this.coreService.updateUser(this.editingRow.id, this.editedData).subscribe({
        next: () => {
          // 🔄 Find index of edited user in `data` array
          const index = this.data.findIndex(user => user.id === this.editingRow.id);
          if (index !== -1) {
            this.data[index] = { ...this.editedData }; // ✅ Update local array
          }
  
          this.editingRow = null;
          this.updated.emit();
          this.edit.emit(this.editedData);
        },
        error: (err) => console.error('Error updating user:', err)
      });
    }
  }
  
  cancelEdit() {
    this.editingRow = null;
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.coreService.deleteUser(userId).subscribe({
        next: () => {
          this.updated.emit();
          this.delete.emit(userId);
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }
}
