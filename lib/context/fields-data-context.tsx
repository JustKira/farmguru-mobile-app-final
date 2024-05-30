import { createContext, useContext } from 'react';
import { useAuth } from './auth-context';
import { useQuery } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import getFieldEndpoint from '~/utils/endpoints/get-field';

import { db } from '../db';
import { Field, fieldsSchema } from '../db/schemas';
import { fieldParser } from '~/utils/parser/field';

interface FieldsDataContextType {
  success: boolean;
  failure: boolean;
  data: Field[] | undefined;
}

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

      const parsedFields = fields?.map(fieldParser);

      if (parsedFields && parsedFields.length > 0) {
        await db.delete(fieldsSchema);
        return (await db.insert(fieldsSchema).values(parsedFields).returning()) as Field[];
      } else {
        throw new Error('No Fields Found');
      }
    },
  });

  if (getFields.isLoading) return loading;

  return (
    <FieldsDataContext.Provider
      value={{
        success: getFields.isSuccess,
        failure: getFields.isError,
        data: getFields.data,
      }}>
      {getFields.isError ? noFieldsFound() : children}
    </FieldsDataContext.Provider>
  );
};

export const useFieldsData = () => {
  const context = useContext(FieldsDataContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
