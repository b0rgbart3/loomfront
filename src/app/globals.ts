import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

// Local paths for Development

basepath = 'http://localhost:3100/';

// Liveserver basepath:
// basepath = 'https://ddworks.org:3100/';

 courseimages =   this.basepath + 'courseimages';
 materials =      this.basepath + 'api/materials';
 materialimages = this.basepath + 'materialimages';
 materialfiles =  this.basepath + 'materialfiles';
 threads =        this.basepath + 'api/threads';
 video =          this.basepath + 'assets/video';
 books =          this.basepath + 'api/books';
 postbookimages = this.basepath + 'api/bookimages';
 bookimages =     this.basepath + 'bookimages';

 chat_server = 'http://localhost:3101';

 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
