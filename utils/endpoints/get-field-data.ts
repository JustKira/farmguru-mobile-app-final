const API_URL = process.env.EXPO_PUBLIC_API;

export default async function getFieldData(fieldId: string, actionMaker: string) {
  return fetch(`${API_URL}/fields/mobile/getFieldDetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ FieldId: fieldId, ActionMaker: actionMaker }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as FarmFieldData;
    }
  });
}
