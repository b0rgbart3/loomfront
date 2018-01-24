import { Material } from './material.model';

export class MaterialCollection {
  _id?: string;

  // This model is just used internally to organize our list of Materials for each section
  constructor (
    public images: Material[],
      public videos: Material[],
      public docs: Material[],
      public books: Material[],
      public audios: Material[],
      public blocks: Material[],
      public quotes: Material[]

  ) {

    this.images = images;
    this.videos = videos;
    this.docs = docs;
    this.books = books;
    this.audios = audios;
    this.blocks = blocks;
    this.quotes = quotes;

  }

  addToCollection(type, materials) {
    this[type] = materials;
  }

}


