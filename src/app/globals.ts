import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

//  assetTypes = ['book', 'doc', 'video', 'audio', 'quote', 'block'];
//  assetLongPluralNames = ['Books', 'PDF Documents', 'Videos', 'Audio Files', 'Pull Quotes', 'HTML Blocks'];
//  assetLongSingularNames = ['Book', 'PDF Document', 'Video', 'Audio File', 'Pull Quote', 'HTML Block'];

 materialTypes = [
        { 'type': 'image',   'longName' : 'Images',          'pluralName' : 'images' },
        { 'type': 'video',   'longName' : 'Videos',          'pluralName' : 'videos' },
        { 'type': 'audio',   'longName' : 'Audio Files',     'pluralName' : 'audios' },
        { 'type': 'doc',     'longName' : 'PDF Documents',   'pluralName' : 'docs' },
        { 'type': 'quote',   'longName' : 'Quotations',      'pluralName' : 'quotes' },
        { 'type': 'block',   'longName' : 'HTML Content',    'pluralName' : 'blocks' },
        { 'type': 'book',    'longName' : 'Book References', 'pluralName' : 'books' }   ];


// Local paths for Development

 // basepath = 'http://localhost:3100/';

// Liveserver basepath:
// basepath = 'https://ddworks.org:8000/';

// This points to the API
basepath = 'http://localhost:3100/';
// basepath = 'https://young-bastion-45095.herokuapp.com/';

// This points to where the images and other assets are stored
awspath = 'https://recloom.s3.amazonaws.com/';

 postcourseimages =   this.basepath + 'api/courseimages';
 courseimages =       this.awspath  + 'courseimages';
 materials =          this.basepath + 'api/materials';
 postmaterialimages = this.basepath + 'api/materialimages';
 materialimages =     this.awspath  + 'materialimages';
 materialfiles =      this.awspath  + 'materialfiles';
 postmaterialfiles =  this.basepath + 'api/materialfiles';
 allmaterialsbytype = this.basepath + 'api/allmaterialsbytype';
 threads =            this.basepath + 'api/threads';
 postavatars =        this.basepath + 'api/avatars';
 avatars =            this.awspath  + 'avatars';
 series =             this.basepath + 'api/series';
 batchmaterials =     this.basepath + 'api/batchmaterials';
 discusssettings =    this.basepath + 'api/discussion/settings';

 enterdiscussion =    this.basepath + 'api/discussion/enter';
 whosin =             this.basepath + 'api/discussion/whosin';


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

 // chat_server = 'http://localhost:8001';

 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
