import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

// Local paths for Development

basepath = 'http://localhost:3100/';

// Liveserver basepath:
// basepath = 'https://ddworks.org:8000/';

 postcourseimages =   this.basepath + 'api/courseimages';
 courseimages =       this.basepath + 'courseimages';
 materials =          this.basepath + 'api/materials';
 postmaterialimages = this.basepath + 'api/materialimages';
 materialimages =     this.basepath + 'materialimages';
 materialfiles =      this.basepath + 'materialfiles';
 postmaterialfiles =  this.basepath + 'api/materialfiles';
 allmaterialsbytype = this.basepath + 'api/allmaterialsbytype';
 threads =            this.basepath + 'api/threads';
 video =              this.basepath + 'assets/video';
 books =              this.basepath + 'api/books';
 docs =               this.basepath + 'api/docs';
 docfiles =           this.basepath + 'docfiles';
 postdocfiles =       this.basepath + 'api/docfiles';
 postbookimages =     this.basepath + 'api/bookimages';
 bookimages =         this.basepath + 'bookimages';
 postdocimages =      this.basepath + 'api/docimages';
 docimages =          this.basepath + 'docimages';

 chat_server = 'http://localhost:8001';

 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
