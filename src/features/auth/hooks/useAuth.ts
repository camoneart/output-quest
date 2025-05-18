// import { useQuery } from '@tanstack/react-query';
// import { api } from '@/lib/api';
// import { User } from '../types';

// export const useAuth = () => {
//   const { data: user, isLoading } = useQuery<User>({
//     queryKey: ['auth'],
//     queryFn: async () => {
//       const response = await api.get('/auth/me');
//       return response.data;
//     },
//   });

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//   };
// }; 