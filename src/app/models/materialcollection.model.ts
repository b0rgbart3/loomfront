import { Material } from './material.model';

export class MaterialCollection {
  _id?: string;

  // This model is just used internally to organize our list of Materials for each section
  constructor (
      public videos: Material[],
      public documents: Material[],
      public books: Material[],
      public audios: Material[],

  ) {

    this.videos = videos;
    this.documents = documents;
    this.books = books;
    this.audios = audios;

  }

}


