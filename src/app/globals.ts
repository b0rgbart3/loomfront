import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

// Local paths for Development



 courseimages = 'http://localhost:3100/courseimages';
 materials = 'http://localhost:3100/api/materials';
 materialimages = 'http://localhost:3100/materialimages';
 materialfiles = 'http://localhost:3100/materialfiles';
 base_path = 'http://localhost:3100';
 threads = 'http://localhost:3100/api/threads';
 chat_server = 'http://localhost:3101';
 video = 'http://localhost:3100/assets/video';


// Live server paths for Deployment

//  courseimages = 'https://ddworks.org:3100/courseimages';
//  materials = 'https://ddworks.org:3100/api/materials';
//  materialimages = 'http://ddworks.org:3100/api/materialimages';
//  base_path = 'https://ddworks.org:3100';
//  threads = 'https://ddworks.org:3100/api/threads';
//  chat_server = 'https://ddworks.org:3101';
//  video = 'https://ddworks.org:3100/assets/video';

 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
