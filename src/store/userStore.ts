import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types';

interface UserStore {
  user: UserInfo | null;
  isLoggedIn: boolean;
  
  setUser: (user: UserInfo) => void;
  logout: () => void;
  resetAccount: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      setUser: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      resetAccount: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'xh-user-storage',
    }
  )
);
