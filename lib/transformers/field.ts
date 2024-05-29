import { NewField } from '../db/schemas';

export function fieldTransformer(data: FarmField): NewField {
  const newField: NewField = {
    id: data.id,
    name: data.name,
    farmId: data.farmId,
    location: [data.location[0][0], data.location[0][1]],
    position: data.position,
    bounds: [
      [data.positionMin[0], data.positionMin[1]],
      [data.positionMax[0], data.positionMax[1]],
    ],
  };
  return newField;
}
