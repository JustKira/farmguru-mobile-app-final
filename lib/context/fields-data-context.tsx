import { createContext } from 'react';
import { useAuth } from './auth-context';
import { useQuery } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import getFieldEndpoint from '~/utils/endpoints/get-field';
import { fieldTransformer } from '../transformers/field';
import { db } from '../db';
import { fieldsSchema } from '../db/schemas';

interface FieldsDataContextType {}

const FieldsDataContext = createContext<FieldsDataContextType | undefined>(undefined);

export const FieldsDataProvider: React.FC<{
  children: JSX.Element;
  loading: JSX.Element;
  noFieldsFound: () => JSX.Element;
}> = ({ children, loading, noFieldsFound }) => {
  const auth = useAuth();

  const getFields = useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const netInfo = await NetInfo.fetch();
      console.log('App Status', netInfo.isConnected ? 'Connected' : 'Not Connected');

      // User is Guaranteed to be logged in Override the type
      const user = auth.user as UserData;

      const fields = await getFieldEndpoint(user.accountId);

      const transformedFields = fields?.map(fieldTransformer);

      if (transformedFields && transformedFields.length > 0) {
        await db.insert(fieldsSchema).values(transformedFields);
      } else {
        throw new Error('No Fields Found');
      }
    },
  });

  if (getFields.isLoading) return loading;

  return (
    <FieldsDataContext.Provider value={undefined}>
      {getFields.isError ? noFieldsFound() : children}
    </FieldsDataContext.Provider>
  );
};
