import { makeAutoObservable, runInAction } from 'mobx';
import apiClient from '@/app/utils/axios-instance';
import { Review } from '@/app/models/types';

class ReviewStore {
  reviews: Review[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchReviewsByUser(userId: string) {
    this.loading = true;
    try {
      const response = await apiClient.get(`/users/${userId}/reviews`);
      runInAction(() => {
        this.reviews = response.data;
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchReviewsByBook(bookId: string) {
    this.loading = true;
    try {
      const response = await apiClient.get<Review[]>(`/books/${bookId}/reviews`);
      runInAction(() => {
        this.reviews = response.data;
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addReview(newReview: Review) {
    try {
      const response = await apiClient.post('/reviews', newReview);
      runInAction(() => {
        this.reviews.push(response.data);
      });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  }

  async updateReview(id: string, updatedReview: Partial<Review>) {
    try {
      await apiClient.patch(`/reviews/${id}`, updatedReview);
      runInAction(() => {
        const index = this.reviews.findIndex((review) => review.id === id);
        if (index !== -1) this.reviews[index] = { ...this.reviews[index], ...updatedReview };
      });
    } catch (error) {
      console.error('Error updating review:', error);
    }
  }

  async deleteReview(id: string) {
    try {
      await apiClient.delete(`/reviews/${id}`);
      runInAction(() => {
        this.reviews = this.reviews.filter((review) => review.id !== id);
      });
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }
}

export const reviewStore = new ReviewStore();
