
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useStore = create(
	persist(
		(set) => ({
			// Initial state
			user: {
				email: '',
				accessToken:'',
				refreshToken:'',
			},
			attending:{},
			position:"",
			// actions
			startAttending: (data) => set({ data }),
			startLogin: (user) => set({ user }),
			startLogout: () => {
				set({ user: {}  });
			},
			changePosition: (data) => set({ data }),
		}),
		{
			name: 'auth-storage',
		}
	)
);
