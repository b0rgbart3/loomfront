import { Component, OnInit, Input } from '@angular/core';
import { ClassModel } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css'],
  providers: [ClassService]
})

export class ClassListComponent implements OnInit {

  selectedClass: {};
  errorMessage: string;
  admin: boolean;

@Input() classes: ClassModel[];
@Input() showRegButtons: boolean;

  constructor(private classService: ClassService) { }

  ngOnInit() {

  }

  private getIndexOfClass = (classId: String) => {
    return this.classes.findIndex( (classObject ) => {
      return classObject._id === classId;
    });
  }

  selectClass(classObject: ClassModel) {
    this.selectedClass = classObject;
  }

  createNewClass() {
    const classObject: ClassModel = {
      id: '0', title: '', course: '', start: '', end: '',
       courseObject: null, courseImageURL: '', cost: '', costBlurb: ''
    };

    // By default, a newly-created course will have the selected state.
    this.selectClass( classObject );
  }

  deleteClass = (classId: String) => {
    const idx = this.getIndexOfClass(classId);
    if (idx !== -1) {
      this.classes.splice(idx, 1);
      this.selectClass(null);
    }
    return this.classes;
  }

  addClass = (classObject: ClassModel) => {
    this.classes.push(classObject);
    this.selectClass(classObject);
    return this.classes;
  }

  updateClass= (classObject: ClassModel) => {
    const idx = this.getIndexOfClass(classObject._id);
    if (idx !== -1) {
      this.classes[idx] = classObject;
      this.selectClass(classObject);
    }
    return this.classes;
  }
}
