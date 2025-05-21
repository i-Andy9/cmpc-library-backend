export class BookResponseDto {
  title: string;
  author: string;
  publisher?: string;
  price: number;
  available?: boolean;
  genre: string;
  imageUrl?: string;
}
