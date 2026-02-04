import { Component, inject, Input, OnInit } from '@angular/core';
import { Language } from '../../../../../core/services/language';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../../../../core/enums/service/permission-service';

@Component({
  selector: 'app-permission-multi-select',
  imports: [
    MatFormFieldModule,
    MatSelectModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './permission-multi-select.html'
})
export class PermissionMultiSelect implements OnInit {

  // ################ Injecting

  language = inject(Language)
  fb = inject(FormBuilder);
  permissionService = inject(PermissionService);
  // ################ Initiate data

  groups = [
    {
      name: "Student Notes",
      items: [
        { value: 1, view: this.language.transform('get_student_note_permission') },
        { value: 2, view: this.language.transform('add_student_note_permission') },
        { value: 3, view: this.language.transform('update_student_note_permission') },
        { value: 4, view: this.language.transform('delete_student_note_permission') },
        { value: 9, view: this.language.transform('release_student_note_to_parent_permission') },
        { value: 10, view: this.language.transform('solve_student_note_permission') }
      ]
    },
    {
      name: "Points",
      items: [
        { value: 5, view: this.language.transform('get_point_permission') },
        { value: 6, view: this.language.transform('add_point_permission') },
        { value: 7, view: this.language.transform('update_point_permission') },
        { value: 8, view: this.language.transform('delete_point_permission') }
      ]
    },
    {
      name: "Student Attendance",
      items: [
        { value: 11, view: this.language.transform('get_student_attendance_permission') },
        { value: 12, view: this.language.transform('add_student_attendance_permission') },
        { value: 13, view: this.language.transform('update_student_attendance_permission') },
        { value: 14, view: this.language.transform('delete_student_attendance_permission') },
        { value: 15, view: this.language.transform('release_student_attendance_to_parent_permission') },
        { value: 16, view: this.language.transform('solve_student_attendance_permission') }
      ]
    },
    {
      name: "Student Actions",
      items: [
        { value: 17, view: this.language.transform('expel_student_permission') }
      ]
    },
    {
      name: "Parent Visits",
      items: [
        { value: 18, view: this.language.transform('get_parent_visit_history_permission') },
        { value: 19, view: this.language.transform('add_parent_visit_history_permission') },
        { value: 20, view: this.language.transform('update_parent_visit_history_permission') },
        { value: 21, view: this.language.transform('delete_parent_visit_history_permission') },
        { value: 22, view: this.language.transform('confirm_parent_visit_permission') }
      ]
    }
  ];

  // ################### input
  @Input() form!: FormGroup;
  
  @Input() permissions?:number[]

  ngOnInit(): void {
    console.log(this.permissions);
    this.form.addControl(
      'permissions',
      this.fb.control(this.permissions ?? [], [Validators.required])
    );
      
  }

  previousSelectedPermissions:number[] = [];

  onSelectionChange(event: MatSelectChange) {
    const current = event.value as number[];
    const previous = this.previousSelectedPermissions;

    const allIds = this.permissionService.permissions.map(x => x.id);

    const added = current.filter(x => !previous.includes(x));
    const removed = previous.filter(x => !current.includes(x));

    const clicked = added[0] ?? removed[0]; // العنصر المتغير

    let result = [...current];

    // 🟢 ضغط ALL
    if (clicked === -1) {
      if (previous.includes(-1)) {
        // كان الكل محدد → الغي الكل
        result = [];
      } else {
        // تحديد الكل
        result = [-1, ...allIds];
      }
    }
    else {

      // 🟡 كان الكل محدد وضغط عنصر
      if (previous.includes(-1)) {
        result = current.filter(x => x !== -1);
      }

      // 🟢 صار كل العناصر محددين
      const withoutAll = result.filter(x => x !== -1);
      if (withoutAll.length === allIds.length) {
        result = [-1, ...allIds];
      }
    }

    this.form.patchValue({ permissions: result }, { emitEvent: false });
    this.previousSelectedPermissions = result;
  }


}

