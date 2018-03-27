import { Material } from './material.model';

export class MaterialCollection {
  _id?: string;

  // This model is just used internally to organize our list of Materials for each section
  constructor (
    public audios: Material[],
    public blocks: Material[],
    public books: Material[],
    public docs: Material[],
    public images: Material[],
    public quotes: Material[],
    public videos: Material[],
  ) {

    this.audios = audios;
    this.blocks = blocks;
    this.books = books;
    this.docs = docs;
    this.images = images;
    this.quotes = quotes;
    this.videos = videos;
  }

  addToCollection(type, materials) {
    this[type] = materials;
  }

}


