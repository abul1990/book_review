import { makeAutoObservable } from 'mobx';
import { User } from '../models/types';
import apiClient from '../utils/axios-instance';

class UserStore {
  users: User[] = [];
  loggedInUser: User | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private init() {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (this.isValidUser(parsedUser)) {
          this.loggedInUser = parsedUser;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve user from local storage:', error);
    }
  }
  private isValidUser(user: any): user is User {
    return user && typeof user.email === 'string';
  }

  async registerUser(user: User) {
    this.loading = true;

    try {
      const response = await apiClient.post('/users', user);

      if (response.status === 200) {
        const user: User = response.data;
        this.loggedInUser = user;
        return true;
      } else {
        this.error = 'User registration failed!';
        return false;
      }
    } catch (error) {
      this.error = 'Something went wrong!!';
      console.error('Login error:', error);
      return false;
    } finally {
      this.loading = false;
    }
  }

  async login(credentials: { email: string; password: string }) {
    this.loading = true;

    try {
      const response = await apiClient.post('/users/login', credentials);

      if (response.status === 201) {
        const user: User = response.data;
        this.loggedInUser = user;
        return true;
      } else {
        this.error = 'Invalid credentials!';
        return false;
      }
    } catch (error) {
      this.error = 'Something went wrong!!';
      console.error('Login error:', error);
      return false;
    } finally {
      this.loading = false;
    }
  }
}

export const userStore = new UserStore();

