export interface AllBreeds {
  [breed: string]: string[] | undefined;
}

export interface Image {
  url: string;
  altText: string;
  // It is not provided by the API, we add id later to use as key
  id: number;
}
