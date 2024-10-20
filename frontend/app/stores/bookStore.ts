import { makeAutoObservable, runInAction } from 'mobx';
import apiClient from '@/app/utils/axios-instance';
import { Book, RatingDistribution } from '@/app/models/types';

class BookStore {
  books: Book[] = [];
  selectedBook: Book | null = null;
  ratingDistribution: RatingDistribution[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBooks() {
    this.loading = true;
    try {
      const response = await apiClient.get('/books');
      runInAction(() => {
        this.books = response.data;
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addBook(formData: FormData) {
    try {
      const response = await apiClient.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      runInAction(() => {
        this.books.push(response.data);
      });
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  }

  async getBook(id: string) {
    try {
      const response = await apiClient.get(`/books/${id}`);
      runInAction(() => {
        this.selectedBook = response.data;
      });
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  }

  async refreshSelectedBook(id: string) {
    Promise.all([this.getBook(id), this.getDistribution(id)]);
  }

  async getDistribution(id: string) {
    const response = await apiClient.get<RatingDistribution[]>(`/books/${id}/reviews/rating-distribution`);
    this.ratingDistribution = response.data;
  }

  async updateBook(bookId: string, updatedBook: FormData) {
    try {
      console.log('updatedBook => ', updatedBook);
      const response = await apiClient.put(`/books/${bookId}`, updatedBook, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      runInAction(() => {
        const index = this.books.findIndex((book) => book.id === bookId);
        if (index !== -1) {
          this.books[index] = response.data;
        }
      });
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  }

  async deleteBook(id: string) {
    try {
      await apiClient.delete(`/books/${id}`);
      runInAction(() => {
        this.books = this.books.filter((book) => book.id !== id);
      });
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  }

  setSelectedBook(book: Book | null) {
    this.selectedBook = book;
  }

  searchBooks(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerCaseQuery) ||
        book.author.toLowerCase().includes(lowerCaseQuery)
    );
  }
}

export const bookStore = new BookStore();
