import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { FieldDetails } from '../db/schemas';

const useGetFieldDetailsQuery = (fid?: string) =>
  useQuery({
    queryKey: ['l-field-details', fid],
    enabled: !!fid,
    queryFn: async () => {
      return (await db.query.fieldsDetailsSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      })) as FieldDetails;
    },
  });

export default useGetFieldDetailsQuery;
