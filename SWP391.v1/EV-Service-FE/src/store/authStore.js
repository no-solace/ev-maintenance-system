import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/config';
import { authService } from '../services/authService';
// call real API
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      login: async (credentials) => {
        console.log('🔑 Starting login...');
        set({ isLoading: true });
        try {
          // Call real backend API
          console.log('📡 Calling authService.login...');
          const response = await authService.login({
            username: credentials.email,
            password: credentials.password
          });
          
          console.log('✅ Login response received:', {
            hasToken: !!response.token,
            hasUser: !!response.user,
            tokenPreview: response.token ? response.token.substring(0, 20) + '...' : null
          });
          
          // Store token in localStorage
          console.log('💾 Saving to localStorage...');
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
          
          // Verify it was saved
          const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          console.log('✅ Verified localStorage save:', {
            tokenSaved: !!savedToken,
            userSaved: !!savedUser,
            keys: Object.keys(STORAGE_KEYS)
          });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log('✅ Auth store updated');
          
          return { success: true, user: response.user };
        } catch (error) {
          console.error('❌ Login failed:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
          };
        }
      },
      
      logout: () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token;
      },
      
      // Initialize auth from localStorage if exists
      initializeAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        console.log('📝 Initializing auth from localStorage:', {
          hasToken: !!token,
          hasUserData: !!userDataStr,
          token: token ? token.substring(0, 20) + '...' : null
        });
        
        if (token && userDataStr) {
          try {
            const user = JSON.parse(userDataStr);
            console.log('✅ Setting auth state:', { user: user.email || user.phone, isAuthenticated: true });
            set({
              user,
              token,
              isAuthenticated: true,
              _hasHydrated: true
            });
            return true;
          } catch (error) {
            console.error('❌ Failed to parse user data:', error);
            return false;
          }
        }
        
        console.log('❌ No auth data found in localStorage');
        return false;
      },
    }),
    {
      name: 'ev_auth_state',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('💧 Zustand rehydrated:', state);
        if (state) {
          state._hasHydrated = true;
          console.log('🔑 Auth state after rehydration:', {
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token,
            hasUser: !!state.user
          });
        }
      },
    }
  )
);
export default useAuthStore;
