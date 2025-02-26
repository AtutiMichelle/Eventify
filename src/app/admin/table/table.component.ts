import { Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
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
  @Input() searchQuery:string='';
  @Input() showSearch: boolean = false; 
  @Input() showCancelButton: boolean=false;

  @Output() updated = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() search =new EventEmitter<string>();
  @Output() cancelEvent = new EventEmitter<number>();

  editingRow: any = null;
  editedData: any = {};

  columnMapping: { [key: string]: string } = {
    'Date Joined': 'date_joined' // Map column name to correct key
  };

  isDeleting:boolean=false;

  constructor(private coreService: CoreService, private cdRef: ChangeDetectorRef) {}

  onSearch(){
    this.search.emit(this.searchQuery);
  }
 
  editRow(row: any) {
  this.editingRow = row;
  this.editedData = { ...row };
}

saveEdit() {
  console.log(this.editedData);
  if (this.editingRow) {
    // Check if we are editing a user or an event
    if ('email' in this.editingRow) { // If row has a email, it's a user
      this.coreService.updateUser(this.editingRow.id, this.editedData).subscribe({
        next: () => {
          const index = this.data.findIndex(user => user.id === this.editingRow.id);
          if (index !== -1) {
            this.data[index] = { ...this.editedData };
          }
          this.editingRow = null;
          this.updated.emit();
          this.cdRef.detectChanges();
        },
        error: (err) => console.error('Error updating user:', err)
      });
    } else { // Otherwise, it's an event
      this.coreService.updateEvent(this.editingRow.id, this.editedData).subscribe({
        next: () => {
          const index = this.data.findIndex(event => event.id === this.editingRow.id);
          if (index !== -1) {
            this.data[index] = { ...this.editedData };
          }
          this.editingRow = null;
          this.updated.emit();
          this.cdRef.detectChanges();
        },
        error: (err) => console.error('Error updating event:', err)
      });
    }
  }
}
deleteRow(id: number) {
  // Flag to check if deletion is in progress
  if (this.isDeleting) return;
  this.isDeleting = true; // Set flag to true, indicating deletion is in progress

  if (confirm('Are you sure you want to delete this item?')) {
    // Check if it's a user or event
    if (this.data.some(item => 'email' in item)) {
      this.coreService.deleteUser(id).subscribe({
        next: () => {
          this.data = this.data.filter(user => user.id !== id); // Remove deleted user from UI
          this.updated.emit();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error deleting user');
        },
        complete: () => {
          this.isDeleting = false; // Reset flag after completion
        }
      });
    } else {
      this.coreService.deleteEvent(id).subscribe({
        next: () => {
          this.data = this.data.filter(event => event.id !== id); // Remove deleted event from UI
          this.updated.emit();
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Error deleting event');
        },
        complete: () => {
          this.isDeleting = false; // Reset flag after completion
        }
      });
    }
  } else {
    this.isDeleting = false; // Reset flag if the user cancels the deletion
  }
}

  
  cancelEdit() {
    this.editingRow = null;
  }
  onCancel(eventId: number) {
    this.cancelEvent.emit(eventId); // Notify parent component
  }
} 

