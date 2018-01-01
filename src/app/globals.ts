import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

//  assetTypes = ['book', 'doc', 'video', 'audio', 'quote', 'block'];
//  assetLongPluralNames = ['Books', 'PDF Documents', 'Videos', 'Audio Files', 'Pull Quotes', 'HTML Blocks'];
//  assetLongSingularNames = ['Book', 'PDF Document', 'Video', 'Audio File', 'Pull Quote', 'HTML Block'];

 materialTypes = [
        { 'type': 'video',   'longName' : 'Vidoes',          'pluralName' : 'videos' },
        { 'type': 'audio',   'longName' : 'Audio Files',     'pluralName' : 'audios' },
        { 'type': 'doc',     'longName' : 'PDF Documents',   'pluralName' : 'docs' },
        { 'type': 'quote',   'longName' : 'Quotations',      'pluralName' : 'quotes' },
        { 'type': 'block',   'longName' : 'HTML Content',    'pluralName' : 'blocks' },
        { 'type': 'book',    'longName' : 'Book References', 'pluralName' : 'books' }   ];


// Local paths for Development

// basepath = 'http://localhost:3100/';

// Liveserver basepath:
// basepath = 'https://ddworks.org:8000/';

basepath = 'https://young-bastion-45095.herokuapp.com/';

 postcourseimages =   this.basepath + 'api/courseimages';
 courseimages =       this.basepath + 'courseimages';
 materials =          this.basepath + 'api/materials';
 postmaterialimages = this.basepath + 'api/materialimages';
 materialimages =     this.basepath + 'materialimages';
 materialfiles =      this.basepath + 'materialfiles';
 postmaterialfiles =  this.basepath + 'api/materialfiles';
 allmaterialsbytype = this.basepath + 'api/allmaterialsbytype';
 threads =            this.basepath + 'api/threads';

//  videos =             this.basepath + 'api/videos';
//  boosk =              this.basepath + 'api/books';
//  docs =               this.basepath + 'api/docs';
//  videofiles =         this.basepath + 'videos';
//  docfiles =           this.basepath + 'docfiles';
//  postdocfiles =       this.basepath + 'api/docfiles';
//  postbookimages =     this.basepath + 'api/bookimages';
//  bookimages =         this.basepath + 'bookimages';
//  postdocimages =      this.basepath + 'api/docimages';
//  docimages =          this.basepath + 'docimages';

 chat_server = 'http://localhost:8001';

 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
