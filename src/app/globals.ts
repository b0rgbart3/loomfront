import { Injectable } from '@angular/core';

@Injectable()
export class Globals {

// Local paths for Development
 // base_path = 'http://localhost:3100';
 // chat_server = 'http://localhost:3101';
 courseimages = 'http://localhost:3100/courseimages';
 materials = 'http://localhost:3100/api/materials';
 base_path = 'http://localhost:3100';
 threads = 'http://localhost:3100/api/threads';
 chat_server = 'http://localhost:3101';


// Live server paths for Deployment
//  courseimages = 'https://ddworks.org:3100/courseimages';
//  materials = 'https://ddworks.org:3100/api/materials';
//  base_path = 'https://ddworks.org:3100';
//  threads = 'https://ddworks.org:3100/api/threads';
//  chat_server = 'https://ddworks.org:3101';


}
