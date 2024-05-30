import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import useCacheTracker from '../hooks/use-cache-tracker';
import LoginEndpoint from '~/utils/endpoints/login';
import useCacheTracker from '../hooks/use-cache-tracker';
import { db } from '../db';
import {
  fieldsDetailsSchema,
  fieldsMapInfoSchema,
  fieldsSchema,
  fieldsScoutPointsSchema,
} from '../db/schemas';

export interface AuthContextType {
  user: UserData | null;
  authenticate: (
    email: string,
    password: string
  ) => Promise<{
    authenticated: boolean;
  }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: JSX.Element;
  loading: JSX.Element;
  userNotFound: JSX.Element;
}> = ({ children, userNotFound, loading }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserData | null>(null);
  const cache = useCacheTracker();
  const getUser = useQuery({
    queryKey: ['user-auth'],
    queryFn: () => AsyncStorage.getItem('user'),
    retry: false,
  });

  const authenticateMutation = useMutation({
    mutationKey: ['mut-user-auth'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      LoginEndpoint(email, password),
    onSuccess: async (data) => {
      await AsyncStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      console.log('User', data);
      getUser.refetch();
    },
    onError: (error) => {
      console.error('Error', error);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['mut-user-logout'],
    mutationFn: () => AsyncStorage.removeItem('user'),
    onSuccess: async () => {
      setUser(null);
      cache.clearTime();

      await Promise.all([
        db.delete(fieldsSchema),
        db.delete(fieldsMapInfoSchema),
        db.delete(fieldsScoutPointsSchema),
        db.delete(fieldsDetailsSchema),
      ]);

      queryClient.clear();
    },
  });

  useEffect(() => {
    if (getUser.data) {
      setUser(JSON.parse(getUser.data));
    }
  }, [getUser.data]);

  const authenticate = async (email: string, password: string) => {
    const res = await authenticateMutation.mutateAsync({ email, password });
    return res.loginId ? { authenticated: true } : { authenticated: false };
  };

  const signOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const value = { user, authenticate, signOut };

  if (getUser.isLoading) return loading;

  return (
    <AuthContext.Provider value={value}>
      {getUser.data ? <>{children}</> : <>{userNotFound}</>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
