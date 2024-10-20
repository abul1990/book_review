import { makeAutoObservable, runInAction } from 'mobx';
import Cookies from 'js-cookie';
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
    if (typeof window !== 'undefined') {
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
  }
  private isValidUser(user: User): user is User {
    return user && typeof user.email === 'string';
  }

  async registerUser(user: FormData) {
    this.loading = true;

    try {
      const response = await apiClient.post('/users', user, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
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

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<boolean> {
    this.loading = true;

    try {
      const response = await apiClient.post('/auth/login', credentials);

      if (response.status === 200) {
        const { access_token, user } = response.data;
        runInAction(() => {
          this.loggedInUser = user;
          if (typeof window !== 'undefined') {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
          }
          Cookies.set('access_token', access_token, {
            expires: 1,
            secure: true,
          });
        });
        return true;
      } else {
        this.error = 'Invalid credentials!';
        return false;
      }
    } catch (error) {
      console.error(error);
      this.error = 'Something went wrong!!';
      return false;
    } finally {
      this.loading = false;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    const response = await apiClient.post('/auth/validate-token', { token });
    if (response.status === 200) {
      const { isValid } = response.data;
      return isValid;
    }
    return false;
  }

  logout() {
    this.loggedInUser = null;
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    Cookies.remove('access_token');
  }
}

export const userStore = new UserStore();
