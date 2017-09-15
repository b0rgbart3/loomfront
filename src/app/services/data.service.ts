import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable() 

export class DataService implements OnInit {
    private messageSource = new BehaviorSubject<string>(localStorage.getItem('message'));
    currentMessage = this.messageSource.asObservable();

    constructor() {

    }
    ngOnInit()
    {
        this.changeMessage ( localStorage.getItem('message')  );
    }


    changeMessage(message:string)
    {
        this.messageSource.next(message);
        localStorage.setItem('message', JSON.stringify({ message : message }));
        
    }
}