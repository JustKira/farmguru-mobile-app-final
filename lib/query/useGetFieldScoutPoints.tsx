import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { FieldsScoutPoints } from '../db/schemas';

const useGetFieldScoutPointsQuery = (fid?: string) =>
  useQuery({
    queryKey: ['l-field-scout-points', fid],
    enabled: !!fid,
    queryFn: async () => {
      return (await db.query.fieldsScoutPointsSchema.findMany({
        where(fields, operators) {
          return operators.eq(fields.fieldId, fid as string);
        },
      })) as FieldsScoutPoints[];
    },
  });

export default useGetFieldScoutPointsQuery;
