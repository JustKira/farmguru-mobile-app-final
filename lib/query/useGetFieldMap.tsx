import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { Field, FieldsMapInfo } from '../db/schemas';

const useGetFieldMapQuery = (fid?: string) =>
  useQuery({
    queryKey: ['l-field-map', fid],
    enabled: !!fid,
    queryFn: async () => {
      return (await db.query.fieldsMapInfoSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      })) as FieldsMapInfo;
    },
  });

export default useGetFieldMapQuery;
