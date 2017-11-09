import { Injectable } from '@angular/core';

@Injectable()
export class Globals {

// Local paths for Development
 base_path = 'http://localhost:3100';
 chat_server = 'http://localhost:3101';

// Live server paths for Deployment
//  base_path = 'https://ddworks.org:3100';
//  chat_server = 'https://ddworks.org:3101';
}
