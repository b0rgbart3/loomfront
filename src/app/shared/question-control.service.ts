import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor(private fb: FormBuilder) { }

  toFormGroup(questions: QuestionBase<any>[][] ) {
    const group: any = [];
    let indexer = 0;

    questions.forEach(question => {
      const subgroup: any = {};
      question.forEach(subquestion => {
        subgroup[subquestion.key] = subquestion.required ? new FormControl(subquestion.value || '', Validators.required)
                                              : new FormControl(subquestion.value || '');
      });
      const thisFormArray = this.fb.array([new FormGroup(subgroup)]);
      group[indexer] = thisFormArray;
      indexer++;
   });
    return new FormGroup(group);
  }
}
