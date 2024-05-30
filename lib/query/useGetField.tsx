import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { Field } from '../db/schemas';

const useGetFieldQuery = (fid?: string) =>
  useQuery({
    queryKey: ['l-field', fid],
    enabled: !!fid,
    queryFn: async () => {
      return (await db.query.fieldsSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      })) as Field;
    },
  });

export default useGetFieldQuery;
