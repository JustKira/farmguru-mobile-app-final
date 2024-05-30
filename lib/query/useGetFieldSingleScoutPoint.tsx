import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { FieldsScoutPoints } from '../db/schemas';

const useGetFieldSingleScoutPointQuery = (id?: string) =>
  useQuery({
    queryKey: ['l-field-single-scout-point', id],
    enabled: !!id,
    queryFn: async () => {
      return (await db.query.fieldsScoutPointsSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, id as string);
        },
      })) as FieldsScoutPoints;
    },
  });

export default useGetFieldSingleScoutPointQuery;
