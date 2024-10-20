export interface Book {
  id?: string;
  title: string;
  author: string;
  publicationDate: string;
  rating?: number;
  coverUrl?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  coverPicUrl?: string;
}

export interface Review {
  id?: string;
  bookId: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt?: string;
  user?: User;
  book?: Book;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}