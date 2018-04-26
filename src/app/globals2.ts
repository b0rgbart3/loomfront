import { Injectable } from '@angular/core';

@Injectable()


export class Globals {

//  assetTypes = ['book', 'doc', 'video', 'audio', 'quote', 'block'];
//  assetLongPluralNames = ['Books', 'PDF Documents', 'Videos', 'Audio Files', 'Pull Quotes', 'HTML Blocks'];
//  assetLongSingularNames = ['Book', 'PDF Document', 'Video', 'Audio File', 'Pull Quote', 'HTML Block'];

 materialTypes = [
        { 'type': 'audio',   'longName' : 'Audio Files',        'pluralName' : 'audios' },
        { 'type': 'block',   'longName' : 'Blocks of Content',  'pluralName' : 'blocks' },
        { 'type': 'book',    'longName' : 'Book References',    'pluralName' : 'books' },
        { 'type': 'doc',     'longName' : 'PDF Documents',      'pluralName' : 'docs' },
        { 'type': 'image',   'longName' : 'Images',             'pluralName' : 'images' },
        { 'type': 'quote',   'longName' : 'Quotations',         'pluralName' : 'quotes' },
        { 'type': 'video',   'longName' : 'Videos',             'pluralName' : 'videos' },
         ];


// Local paths for Development

 // basepath = 'http://localhost:3100/';

// Liveserver basepath:
// basepath = 'https://ddworks.org:8000/';

// This points to the API
// basepath = 'http://localhost:3100';
//

// basepath = 'https://young-bastion-45095.herokuapp.com';
 basepath = 'https://thawing-reaches-29763.herokuapp.com';
// basepath = 'http://localhost:4200';
// basepath = 'https://ddworks.org';

api_path = this.basepath + '/api/';
// This points to where the images and other assets are stored
awspath = 'https://recloom.s3.amazonaws.com/';

authenticate =       this.api_path + 'authenticate';
users =              this.api_path + 'users';
classes =            this.api_path + 'classes';
courses =            this.api_path + 'courses';
postcourseimages =   this.api_path + 'courseimages';
materials =          this.api_path + 'materials';
postmaterialimages = this.api_path + 'materialimages';
postmaterialfiles =  this.api_path + 'materialfiles';
allmaterialsbytype = this.api_path + 'allmaterialsbytype';
threads =            this.api_path + 'threads';
postavatars =        this.api_path + 'avatars';
series =             this.api_path + 'series';
batchmaterials =     this.api_path + 'batchmaterials';
discussionsettings = this.api_path + 'discussionsettings';
notessettings =      this.api_path + 'notessettings';
// enterdiscussion =    this.api_path + 'discussion/enter';
// whosin =             this.api_path + 'discussion/whosin';
enrollments =        this.api_path + 'enrollments';
assignments =        this.api_path + 'assignments';
messages =           this.api_path + 'messages';
sendCFMsg =          this.api_path + 'sendCFMsg';
announcements =      this.api_path + 'announcements';

courseimages =       this.awspath  + 'courseimages';
materialimages =     this.awspath  + 'materialimages';
materialfiles =      this.awspath  + 'materialfiles';
avatars =            this.awspath  + 'avatars';


 fb_app_params = {
    appId: '143123396316217',
    xfbml: true,
    version: 'v2.11'
  };

}
