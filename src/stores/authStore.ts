import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'ta';
  department: string;
  profileImage?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
};

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Rahul Sharma',
    email: 'rahul.sharma@iiita.ac.in',
    password: 'password123',
    role: 'professor' as const,
    department: 'Computer Science',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Priya Mishra',
    email: 'priya.mishra@iiita.ac.in',
    password: 'password123',
    role: 'ta' as const,
    department: 'Computer Science',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // In a real app, this would be an API call
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
          });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      updateProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);